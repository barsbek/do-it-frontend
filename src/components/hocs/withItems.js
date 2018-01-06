import React, { Component } from 'react';
import axios from 'axios';
import { arrayMove } from 'react-sortable-hoc';

import Storage    from '../../modules/Storage';
import { isNew }  from '../../modules/helpers';

function withItems(options) {
  return function Wrapper(WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);
        this.setStorage();

        this.state = {
          creatable: true,
          loading: !this.storage.data,
          items: this.storage.data || [],
        }
      }

      setStorage(id = this.props.withID) {
        this.storage = new Storage(options.storageName, id);
      }

      componentWillMount() {
        const id = this.props.withID;
        if( isNew(id) ) return false;        

        const pathname = id ? `${options.pathname}/${id}` : options.pathname;
        axios.get(pathname)
        .then(res => {
          const { last_update } = res.data;
          const items = res.data[options.itemsName];
          if(this.storage.olderThan(last_update)) {
            this.storage.set(items, last_update);
            this.setState({ items, loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
          this.setState({ loading: false });
        });
      }

      componentWillReceiveProps(nextProps) {
        const location = this.props.location;
        if(location && nextProps.location !== location) {
          this.setStorage(nextProps.withID);
          this.setState({ items: this.storage.data || [] })
        }
      }

      onCreate(item) {
        let items = this.state.items.slice();
        for(let i = 0; i<items.length; i++) {
          if( isNew(items[i].id) ) {
            this.setState({ creatable: true });
            items[i] = item;
            break;
          }
        }

        this.updateLocal(items, item.updated_at);
      }

      updateLocal(items, last_update) {
        this.storage.set(items, last_update);
        this.setState({ items });
      }

      onSortEnd({ oldIndex, newIndex }) {
        if(oldIndex !== newIndex) {
          const movedItems = this.state.items.map((x, index) => {
            if(index === oldIndex) x.moved = newIndex + 1;
            else x.moved = false;
            return x;
          });
          const items = arrayMove(movedItems, oldIndex, newIndex);
          this.setState({ items });
        }
      }

      onUpdate(item) {
        const items = this.state.items.map(c => {
          if(c.id === item.id) return item;
          return c;
        });

        this.updateLocal(items, item.updated_at);
      }

      onDelete(data) {
        let { item, last_update } = data;
        const items = this.state.items.filter(c => {
          return c.id !== item.id; 
        });

        last_update = last_update ? last_update : this.lastUpdateFrom(items);
        const creatable = isNew(item.id) ? true : this.state.creatable;
        this.storage.set(items, last_update);
        this.setState({ items, creatable });
      }

      lastUpdateFrom(items) {
        if(items.length > 0) {
          const initial = Date.parse(items[0].updated_at);
          return items.reduce((maxDate, c) => (
            Math.max(maxDate, Date.parse(c.updated_at)) 
          ), initial);
        }
        return null;
      }

      onNewItem(item, append = false, creatable = false) {
        if(this.state.creatable) {
          if(!item.id) item.id = "new";
          this.setState(prevState => {
            const items = append ?
              [...prevState.items, item] :
              [item, ...prevState.items];
            return { items, creatable }
          });
        }
      }

      getHandlers() {
        return {
          onCreate: this.onCreate.bind(this),
          onUpdate: this.onUpdate.bind(this),
          onDelete: this.onDelete.bind(this),
          newItem:  this.onNewItem.bind(this),
          onSortEnd: this.onSortEnd.bind(this),
        }
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...this.state}
            handlers={this.getHandlers()}
          />
        )
      }
    }
  }
}

export default withItems;

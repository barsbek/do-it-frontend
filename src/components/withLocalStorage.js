import React, { Component } from 'react';
import axios from 'axios';

import Storage from '../modules/Storage';

function withLocalStorage(options) {
  return function Wrapper(WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);
        const id = this.props.withID;
        const storageName =  id ? `${options.storageName}/${id}` : options.storageName;
        this.storage = new Storage(storageName);

        this.state = {
          creatable: true,
          loading: !this.storage.data,
          items: this.storage.data || []
        }
      }


      componentWillMount() {
        const id = this.props.withID;
        if(id === "new") return false;        
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
          alert(err);
          this.setState({ loading: false });
        });
      }

      onCreate(item) {
        const items = this.state.items.map(c => {
          if(c.id === "new") {
            this.setState({ creatable: true });
            return item;
          }
          return c;
        });

        this.updateLocal(items, item.updated_at);
      }

      updateLocal(items, last_update) {
        this.storage.set(items, last_update);
        this.setState({ items });
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
        const creatable = item.id === 'new' ? true : this.state.creatable;
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

      onNewItem(item) {
        if(this.state.creatable) {
          this.setState(prevState => ({
            items: [item, ...prevState.items],
            creatable: false
          }));
        }
      }

      render() {
        const storage = {
          onCreate: this.onCreate.bind(this),
          onUpdate: this.onUpdate.bind(this),
          onDelete: this.onDelete.bind(this),
          newItem:  this.onNewItem.bind(this),
        }
        return (
          <WrappedComponent
            {...this.props}
            {...this.state}
            storage={storage}
          />
        )
      }
    }
  }
}

export default withLocalStorage;

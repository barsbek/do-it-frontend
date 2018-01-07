import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import InputWithDelay from '../common/InputWithDelay';
import DateTimePicker from '../common/DateTimePicker';
import PreviewAction  from '../Collection/PreviewAction' ;
import withCrud       from '../hocs/withCrud';
import Storage        from '../../modules/Storage';
import { isNew }      from '../../modules/helpers';

import styles from './Preview.css.js';

const DragHandle = SortableHandle(() => <span style={styles.Sorter}>::</span>);


class CollectionPreview extends Component {
  componentWillUnmount() {
    if(!isNew( this.props.item.id )) this.clearStorage();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.moved && this.props.moved !== nextProps.moved) {
      this.props.crud.update({ position: nextProps.moved });
    }
  }

  clearStorage() {
    const storageName = `collection-${this.props.item.id}`;
    const lists = new Storage(storageName).data;
    if(lists) {
      lists.forEach(list => {
        Storage.delete(`list-${list.id}`)
      });
    }
    Storage.delete(storageName);
  }

  render() {
    const { id, title, finish_at } = this.props.item;
    return (
      <div style={styles.Preview}>
        <div>
        <InputWithDelay
          name="title"
          value={title}
          focus={isNew( id )}
          onChangeStop={title => this.props.crud.change({ title })}
          style={styles.Title}
        />
        <DateTimePicker
          value={finish_at}
          onChange={finish_at => this.props.crud.change({ finish_at })}
          buttonLabel={moment(finish_at).format('llll')}
          buttonStyle={styles.FinishAt}
        />
      </div>
      <div style={styles.Actions} >
        <PreviewAction
          id={id}
          loading={this.props.crud.loading}
          removable={this.props.removable}
          onDelete={() => this.props.crud.delete(this.props.item)}
          onFollow={() => this.props.history.push(`/collections/${id}`)}
        />
        <DragHandle />
      </div>
    </div>
    )
  }
}

const SortablePreview = SortableElement(props => 
  <CollectionPreview {...props} />
);

const PreviewWithCrud = withCrud({
  name: "collection",
  pathname: "/api/collections",
})(SortablePreview);

export default withRouter(PreviewWithCrud);

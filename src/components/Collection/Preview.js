import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import InputWithDelay from '../common/InputWithDelay';
import DateTimePicker from '../common/DateTimePicker';
import PreviewAction  from '../Collection/PreviewAction' ;
import withCrud       from '../hocs/withCrud';
import Storage        from '../../modules/Storage';
import { isNew }      from '../../modules/helpers';

class CollectionPreview extends Component {
  componentWillUnmount() {
    if(!isNew( this.props.item.id )) this.clearStorage();
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
      <div style={{display: 'flex', marginBottom: 18}}>
        <div>
        <InputWithDelay
          name="title"
          value={title}
          focus={isNew( id )}
          onChangeStop={title => this.props.crud.change({ title })}
          style={{ width: 180 }}
        />
        <DateTimePicker
          value={finish_at}
          onChange={finish_at => this.props.crud.change({ finish_at })}
          buttonLabel={moment(finish_at).format('llll')}
          buttonStyle={{ }}
        />
      </div>
      <PreviewAction
        id={id}
        loading={this.props.crud.loading}
        removable={this.props.removable}
        onDelete={() => this.props.crud.delete(this.props.item)}
        onFollow={() => this.props.history.push(`/collections/${id}`)}
      />
    </div>
    )
  }
}

const PreviewWithCrud = withCrud({
  name: "collection",
  pathname: "/api/collections",
})(CollectionPreview);

export default withRouter(PreviewWithCrud);

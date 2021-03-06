/**
 * Configuration dialog
 */

import React from 'react';

import {Divider, List, ListItem, Popover, Subheader, Toggle} from 'material-ui';

import RegexPipelineFilter from './RegexPipelineFilter';

export default class Configuration extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      // Sort filterable pipelines names
      pipelines: this.setupPipelines(props.pipelines, props.disabledPipelines),
      // Configurable sort order
      currentSortOrder: props.sortOrder,
      // List of sort order options openened or not
      sortOrderListOpened: false,
      filterRegexProps: props.filterRegexProps
    };
  }

  componentDidMount() {
    this.setState({
      pipelines: this.setupPipelines(this.props.pipelines, this.props.disabledPipelines)
    });
  }


  // Setup and sort pipelines by name
  setupPipelines(pipelines, disabledPipelines) {
    return pipelines
      .map((p) => {
        return {name: p, active: disabledPipelines.indexOf(p) < 0}
      })
      .sort((a, b) => a.name > b.name ? 1 : -1);
  }

  // Toggles a pipeline on/off
  togglePipeline(p, event) {
    this.props.onTogglePipeline(p.name, event.target.checked);
  }

  // Sort order changed
  sortOrderChanged(sortOrder) {
    this.setState({
      currentSortOrder: sortOrder,
      sortOrderListOpened: false
    });
    this.props.onSortOrderChange(sortOrder);
  }

  openSortOrderList(e) {
    this.setState({
      sortOrderListOpened: true,
      anchorEl: e.target
    });
  }

  closeSortOrderList() {
    this.setState({
      sortOrderListOpened: false
    });
  }

  updateFilterRegexProps() {
    this.props.onFilterRegexPropsChange({
      active: this.state.filterRegexActive,
      value: this.state.filterRegex
    })
  }

  updateFilterRegex(e) {
    this.setState({
      filterRegex: e.target.value
    });
  }

  updateFilterRegexActive(e) {
    this.setState({
      filterRegexActive: e.target.checked
    });
  }

  render() {

    let sortOrders =
      (<List>
          {
            this.props.sortOrders.map((s) => {
                return <ListItem key={s.name} primaryText={s.label} onClick={this.sortOrderChanged.bind(this, s)}/>
              }
            ) }
        </List>
      );

    let pipelines =
      (
        <List>
          <Subheader>Toggle Pipelines</Subheader>

          { this.state.pipelines.map((p) => {
            return <ListItem key={p.name} primaryText={p.name}
                             rightToggle={<Toggle defaultToggled={p.active} onToggle={this.togglePipeline.bind(this, p)} />}/>
          }) }
          <Popover
            open={this.state.sortOrderListOpened}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'center'}}
            targetOrigin={{horizontal: 'left', vertical: 'center'}}
            onRequestClose={this.closeSortOrderList.bind(this)}
            useLayerForClickAway={true}
          >
            {sortOrders}
          </Popover>
        </List>
      );

    return (
      <div>
        <List>
          <Subheader>General</Subheader>
          <ListItem primaryText="Sort Order" secondaryText={this.state.currentSortOrder.label}
                    onClick={this.openSortOrderList.bind(this)}/>
          <Divider />
        </List>
        <RegexPipelineFilter filterRegexProps={this.state.filterRegexProps} onFilterRegexPropsChange={this.props.onFilterRegexPropsChange}/>
        {pipelines}
      </div>
    );
  }
}

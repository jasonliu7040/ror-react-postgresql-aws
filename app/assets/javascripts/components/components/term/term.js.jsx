import { Component, PropTypes } from 'react';
import TermForm from './term_form.js.jsx';


export default class Term extends Component {
    render () {
        const { term, isLoading, actions } = this.props;
        return (
            <div>
                <TermForm term = {term}
                    isLoading={isLoading}
                    actions = {actions} />
            </div>
        );
    }
}


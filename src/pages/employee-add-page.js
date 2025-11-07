import { LitElement, html } from 'lit-element';
import '../components/employee/employee-form.js';

export class EmployeeAddPage extends LitElement {
  render() {
    return html`
      <employee-form mode="add"></employee-form>
    `;
  }
}

customElements.define('employee-add-page', EmployeeAddPage);
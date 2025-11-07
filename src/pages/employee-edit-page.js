import { LitElement, html } from 'lit-element';
import { RouteParameterController } from '../controllers/RouteParameterController.js';
import '../components/employee/employee-form.js';

export class EmployeeEditPage extends LitElement {
  constructor() {
    super();
    
    this.routeController = new RouteParameterController(this);
  }

  onBeforeEnter(location) {
    return this.routeController.onBeforeEnter(location);
  }

  render() {
    return html`
      <employee-form 
        mode="edit" 
        .employeeId="${this.routeController.employeeId}">
      </employee-form>
    `;
  }
}

customElements.define('employee-edit-page', EmployeeEditPage);
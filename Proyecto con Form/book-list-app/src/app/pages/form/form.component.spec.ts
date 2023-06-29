import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormComponent } from "./form.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe('Form component', () => {

    let component:FormComponent;
    let fixture:ComponentFixture<FormComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [FormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

    });

    beforeEach(() => {

        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('name field is required', () => {
        //obtenermos el campo nombre
        const nameField = component.form.get('name'); 
        //seteamos el valor al campo
        nameField.setValue('');
        //verificamos que el campo sea valido o no
        expect(nameField.invalid).toBeTrue();
    });

    it('name field has error with more than 5 chacarcters', () => {
        //obtenermos el campo nombre
        const nameField = component.form.get('name'); 
        //seteamos el valor al campo
        nameField.setValue('test name');
        //verificamos que el campo sea valido o no
        expect(nameField.valid).toBeFalse();
    });

    it('name field has error with less than 5 chacarcters', () => {
        //obtenermos el campo nombre
        const nameField = component.form.get('name'); 
        //seteamos el valor al campo
        nameField.setValue('Jack');
        //verificamos que el campo sea valido o no
        expect(nameField.valid).toBeTrue();
    });

    it('email field is required', () => {
        //obtenermos el campo email
        const nameField = component.form.get('email'); 
        //seteamos el valor al campo
        nameField.setValue('');
        //verificamos que el campo sea valido o no
        expect(nameField.valid).toBeFalse();
    });

    it('email must be invalid', () => {
        //obtenermos el campo email
        const nameField = component.form.get('email'); 
        //seteamos el valor al campo
        nameField.setValue('test@');
        //verificamos que el campo sea valido o no
        expect(nameField.valid).toBeFalse();
    });

    it('email must be valid', () => {
        //obtenermos el campo email
        const nameField = component.form.get('email'); 
        //seteamos el valor al campo
        nameField.setValue('test@gmail.com');
        //verificamos que el campo sea valido o no
        expect(nameField.valid).toBeTrue();
    });

    it('form is valid', () => {
        const nameField = component.form.get('name'); 
        const emailField = component.form.get('email'); 

        nameField.setValue('Jack');
        emailField.setValue('test@gmail.com');

        expect(component.form.valid).toBeTrue();
    });
});
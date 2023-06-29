import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { NavComponent } from "./nav.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from "@angular/router";

//Creamos una clase falsa para simular los componentes a los que cada path o ruta debe ir
class ComponentTestRoute {}

describe('Nav component', () => {

    let component:NavComponent;
    let fixture:ComponentFixture<NavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            //Importamos el modulo para testear rutas
            imports: [
                RouterTestingModule.withRoutes([ //Indicamos los path que vamos a testear y a que componente se dirige.
                    { path: 'home', component: ComponentTestRoute },
                    { path: 'cart', component: ComponentTestRoute }
                ])
            ],
            declarations: [NavComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate', () => {
        const router = TestBed.inject(Router);
        const spy1 = spyOn(router, 'navigate');

        component.navTo('home');
        //verificamos que el navigate va a /home.
        expect(spy1).toHaveBeenCalledWith(['/home']);

        component.navTo('cart');
        //verificamos que el navigate va a /cart.
        expect(spy1).toHaveBeenCalledWith(['/cart']);
    });
});
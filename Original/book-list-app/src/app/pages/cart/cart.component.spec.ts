import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { CartComponent } from "./cart.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from "src/app/services/book.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";
import { By } from '@angular/platform-browser';

const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 2
    },
]

describe('Cart component', () => {
    //Se declara el componente a testear.
    let component:CartComponent;
    //Declaramos otra variable: Utilizaremos para traer, por ej, el servicio inyectado dentro del component, hacer que detecte cambios, etc.
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService; //Variable global con el service.

    //Luego creamos un fichero de configuración TestBed con un event (antes que ejecute un test, ejecuta el beforeEach):
    beforeEach( () => {
        TestBed.configureTestingModule({
            //Siempre HttpClientTestingModule -> Cuando el componente hace una petición http (service), no la hace de manera real. Si utilizamos Angular Material en este componente debemos importar el modulo.
            imports: [
                HttpClientTestingModule
            ],
            //Componente que utilizamos en el test
            declarations: [
                //CartComponent,
            ],
            //Servicios que utiliza el componente.
            providers: [
                BookService,
                CartComponent
            ],
            //Utilizarlas siempre.
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA,
                NO_ERRORS_SCHEMA
            ],
        }).compileComponents();
    });

    //Luego creamos otro beforeEach para instanciar el componente inicializado arriba (component).
    beforeEach( () => {
        fixture = TestBed.createComponent(CartComponent); //Lo extraemos del TestBed anterior de esta manera.
        service = fixture.debugElement.injector.get(BookService); //Instancio el service a utilizar.
        component = fixture.componentInstance; //Lo instanciamos.
        fixture.detectChanges(); //El component entra en onInit haciendo lo que tiene que hacer en su metodo onInit.
        //Espio el llamado del onInit al service dandole como rta al falso llamado el listado de libros que busca.
        spyOn(service, 'getBooksFromCart').and.callFake( () => listBook);
    });

    //Con it creamos cada uno de los unit test.
    // it('should create', () => {
    //     expect(component).toBeTruthy(); //Veremos si se ha instanciado correctamente.
    // });

    it('should create', inject([CartComponent], (testComponente:CartComponent) => {
        expect(testComponente).toBeTruthy();
    }));

    //Testear un metodo con return. Ceo un array de libros fuera del describe para probar y para tenerlo para otros test.
    it('totalPrice', () => {
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0); //El totalPrice es mayor a cero.
        expect(totalPrice).not.toBe(0); //Va a ser 86;
        expect(totalPrice).not.toBeNull(); //No sera null.
    });

    //Testear un método sin return. Aquí se probará que el método llame al los métodos: this._bookService.updateAmountBook(book) o this.getTotalPrice(this.listCartBook).
    it('onInputNumberChange Increments Correctly', () => {
        const action = 'plus';
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2
        }

        const spy1 = spyOn(service,'updateAmountBook').and.callFake(() => null);//Como solo quiero ver que llame al servicio pero no quiero que realmente lo llame hago una falsa llamada que devuelva algo.

        const spy2 = spyOn(component,'getTotalPrice').and.callFake(()=> null);

        //Verificamos si relamente se ha incrementado
        expect(book.amount).toBe(2);
        component.onInputNumberChange(action,book); //Llamamos al método que llama al método del service.
        expect(book.amount).toBe(3);

        expect(spy1).toHaveBeenCalled(); //Testeamos que el método sea llamado correctamente.
        expect(spy2).toHaveBeenCalled();

    });

    it('onInputNumberChange Decrements Correctly', () => {
        const action = 'minus';
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 3
        }

        const spy1 = spyOn(service,'updateAmountBook').and.callFake(() => null);//Como solo quiero ver que llame al servicio pero no quiero que realmente lo llame hago una falsa llamada que devuelva algo.

        const spy2 = spyOn(component,'getTotalPrice').and.callFake(()=> null);

        expect(book.amount).toBe(3);
        component.onInputNumberChange(action,book); //Llamamos al método que llama al método del service.
        expect(book.amount).toBe(2);

        expect(spy1).toHaveBeenCalled(); //Testeamos que el método sea llamado correctamente.
        expect(spy2).toHaveBeenCalled();

    });

    //Probando método privado a través del método público que lo llama.
    it('onClearBooks works correctly', () => {

        //Para espiar un método privado hay que castear con any al método privado. En este caso, para que no me falle el test, hay que llamarlo y a su vez espiarlo, sino no se ejecuta y no limpia.
        const spy1 = spyOn((component as any), '_clearListCartBook').and.callThrough();
        //Espia para el método del service
        const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(()=> null);
        component.listCartBook = listBook;
        component.onClearBooks();

        expect(component.listCartBook.length).toBe(0);
        expect(component.listCartBook.length === 0).toBeTrue();
        expect(spy1).toHaveBeenCalled(); //Vemos si es llamado correctamente.
        expect(spy2).toHaveBeenCalled();
    });

    //Probando método privado a través del método público que lo llama. Excepción.
    it('onClearBooks works correctly', () => {
        component.listCartBook = [];
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(component.listCartBook.length === 0).toBeTrue();
    });

    //TEST INTEGRACIÓN
    it('The title "The cart is empty" is not displayed when there is a cart', () => {
        component.listCartBook = listBook; //El listCartBook le ponemos la lista de libros creada.
        fixture.detectChanges(); //Detecta los cambios (lista actualizada)

        //Capturamos el elemento del html que queremos testear para ver si esta disponible o no. En este caso buscamos el elemento que tiene id titleCartEmpty. Si queremos todos los h5 es queryAll.
        const debugElement:DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeFalsy(); //como lalista tiene elementos no deberia existir.
    });

    xit('The title "The cart is empty" is displayed when the list is empty', () => {
        component.listCartBook = [];
        fixture.detectChanges();

        const debugElement:DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeTruthy();
        if(debugElement){
            const element:HTMLElement = debugElement.nativeElement; //Extraemos el HTML texto que tenemos
            expect(element.innerHTML).toContain("The cart is empty");
        }
    });

})
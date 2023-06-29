import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BookService } from "./book.service";
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { Book } from "../models/book.model";
import { environment } from "src/environments/environment.prod";
import swal from "sweetalert2";

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

const book:Book = {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
}

describe('BookService', () => {

    let service:BookService;
    let httpMock:HttpTestingController; //Usaremos para hacer peticiones mockeadas, no reales.
    let storage = {};

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    beforeEach( () => {
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);

        storage = {}; //Seteamos el storage con cada test, para evitar problemas con los demas test.
        //creamos los espías del localStorage. Como al llamar al localStorage llama a una key('listCartBook') retornamos el storage
        spyOn(localStorage, 'getItem').and.callFake((key:string)=>{
            return storage[key] ? storage[key] : null;
        });

        spyOn(localStorage, 'setItem').and.callFake((key:string, value:string) => {
            return storage[key] = value; //setea la key con el value.
        });
    });

    //Solo se utiliza en servicios que hacen peticiones a apis.
    afterEach( () => {
        httpMock.verify(); //Verifica que no haya peticiones pendientes entre cada test. Para no lanzar el siguiente test si hay peticiones pendientes.
    });
    

    it('should create', () => {
        expect(service).toBeTruthy();
    });


    it('getBooks return a list of books and does a get method', () => {
        service.getBooks().subscribe((resp:Book[]) => {
            expect(resp).toEqual(listBook);
        });

        //Definimos la ruta a la cual se hará la petición.
        const req = httpMock.expectOne(environment.API_REST_URL + `/book`);
        //Se espera que el pedido de dicha URL sea un GET.
        expect(req.request.method).toBe('GET');
        //Como estamos mockeando la respuesta de la api debemos indicarle lo que esperamos:
        req.flush(listBook);
    });


    it('getBooksFromCart return empty when localStorage es empty', () => {
        const listBooks = service.getBooksFromCart();
        expect(listBooks.length).toBe(0);
    });


    it('addBookToCart add a book successfully when the list does not exist in the localStorage', () => {
        //Creamos la variable que utiliza el swal con su método fire para que no tenga error.
        const toast = {
            fire: () => null
        } as any;
        //creamos el espia retornando el resultado del metodo fire sobre el toast.
        const spy1 = spyOn(swal, 'mixin').and.callFake( () => {
            return toast;
        });

        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);

        service.addBookToCart(book);

        listBook = service.getBooksFromCart();
        service.addBookToCart(book);
        expect(listBook.length).toBe(1);
        expect(spy1).toHaveBeenCalled();
    });


    it('removeBooksFromCart removes the list from the localStorage', () => {
        //Agregamos un libro al carrito para tener uno que eliminar.
        service.addBookToCart(book);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);

        service.removeBooksFromCart();
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

});
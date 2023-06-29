import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { HomeComponent } from "./home.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BookService } from "src/app/services/book.service";
import { Book } from "src/app/models/book.model";
import { of } from "rxjs";
import { Pipe, PipeTransform } from '@angular/core';

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

const bookServiceMock = {
    getBooks: () => of(listBook),
}

//Mockeo del pipe, como no me interesa testear el pipe, devuelvo un string vacío para que pase mi test del componente.
@Pipe({name: 'reduceText'})
class ReduceTextMock implements PipeTransform {
    transform():string {
        return '';
    }
}

describe('Home component', () => {

    let component:HomeComponent;
    let fixture:ComponentFixture<HomeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            declarations: [HomeComponent, ReduceTextMock],
            providers: [
                // BookService
                {
                    provide: BookService,
                    useValue: bookServiceMock
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

        }).compileComponents();
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getBook get books from the subscrition', () => {
        //Como utiliza el servicio tenemos que traerlo:
        fixture.debugElement.injector.get(BookService);

        //Luego creamos un espia de dicho service devolviendo un observable.
        //Al mockear el service esta línea de espía no la necesitamos más.
        //const spy1 = spyOn(bookService, 'getBooks').and.returnValue( of(listBook) );

        component.getBooks();

        //expect(spy1).toHaveBeenCalled(); //Ahora con esto ya esta entrando a la suscripción.
        expect(component.listBook.length).toBe(3); //Como pasamos un array de books, el length debería ser 3.

    });

});
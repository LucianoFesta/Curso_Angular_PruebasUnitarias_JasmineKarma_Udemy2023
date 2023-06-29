import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { ConfirmDialogComponent } from "./confirmation-dialog.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

const matDialogRefMock = {
    close: () => null
}; //No me interesa que devuelva nada, solo ver que este llamando a la libreria.

describe('Confirm dialog component', () => {

    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ConfirmDialogComponent],
            providers: [
                //MatDialogRef, 
                //MAT_DIALOG_DATA,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {} //Como no nos interesa recibir una data (info que muestra en dialog), lo dejamos vacío.
                },
                {
                    provide: MatDialogRef,
                    useValue: matDialogRefMock
                }
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onConfirm send true value', () => {
        //Debemos crear un espia para llamar al servicio (MatDialogRef)
        const service = TestBed.inject(MatDialogRef); //Injectamos el servicio que necesitamos.
        const spy = spyOn(service, 'close');

        component.onConfirm();
        expect(spy).toHaveBeenCalledWith(true); //Verificamos la llamada al pasarle true.
    });

    it('onDismiss send false value', () => {
        //Debemos crear un espia para llamar al servicio (MatDialogRef)
        const service = TestBed.inject(MatDialogRef); //Injectamos el servicio que necesitamos.
        const spy = spyOn(service, 'close');

        component.onDismiss();
        expect(spy).toHaveBeenCalledWith(false); //Verificamos la llamada al pasarle true.
    });
});
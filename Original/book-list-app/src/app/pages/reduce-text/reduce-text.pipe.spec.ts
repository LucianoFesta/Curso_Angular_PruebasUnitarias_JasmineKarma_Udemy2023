import { ReduceTextPipe } from "./reduce-text.pipe";

describe('ReduceTextPipe', () => {

    let pipe:ReduceTextPipe;

    beforeEach( ()=> {
        pipe = new ReduceTextPipe();
    });

    it('should create', () => {
        expect(pipe).toBeTruthy();
    });

    //probamos que el método transform funcione. que al texto que recibe le deje solo 5 caracteres.
    it('use transform correctly', () => {
        const text = 'Hello this is a text to check the pipe';
        const newText = pipe.transform(text, 5);

        expect(newText.length).toBe(5);
    });

});


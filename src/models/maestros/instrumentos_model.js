export default class Muestra {
    id; // int
    tipoInstrumentoId; // int (FK)
    tipoInstrumento; // string(30) - join
    claseInstrumento; // string(10) - join
    emisorId; // int (FK)
    emisor; // string (45) - join
    ticker; // string(10)
    notas; // string(150)

    constructor (row) {
        this.id = row.id;
        this.tipoInstrumentoId = row.tipoInstrumentoId;
        this.tipoInstrumento = row.tipoInstrumento;
        this.claseInstrumento = row.claseInstrumento;
        this.emisorId = row.emisorId;
        this.emisor = row.emisor;
        this.ticker = row.ticker;
        this.notas = row.notas;
    }

    toJson () {
        return {
            id: this.id,
            tipoInstrumentoId: this.tipoInstrumentoId,
            tipoInstrumento: this.tipoInstrumento,
            claseInstrumento: this.claseInstrumento,
            emisorId: this.emisorId,
            emisor: this.emisor,
            ticker: this.ticker,
            notas: this.notas
        };
    }

    static fromRows (rows) {
        return rows.map(row => new Muestra(row));
    }
}

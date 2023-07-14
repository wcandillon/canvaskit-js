type Field = { name: string; value: number; type: string };

export class Table {
  constructor(readonly tableName: string, readonly fields: Field[]) {}
}

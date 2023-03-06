export interface IDiplomes {
  id?: number;
}

export class Diplomes implements IDiplomes {
  constructor(public id?: number) {}
}

export function getDiplomesIdentifier(diplomes: IDiplomes): number | undefined {
  return diplomes.id;
}

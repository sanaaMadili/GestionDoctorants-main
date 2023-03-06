export interface IInformation {
  id?: number;
}

export class Information implements IInformation {
  constructor(public id?: number) {}
}

export function getInformationIdentifier(information: IInformation): number | undefined {
  return information.id;
}

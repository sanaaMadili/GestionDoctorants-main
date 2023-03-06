export interface IProfile {
  id?: number;
}

export class Profile implements IProfile {
  constructor(public id?: number) {}
}

export function getProfileIdentifier(profile: IProfile): number | undefined {
  return profile.id;
}

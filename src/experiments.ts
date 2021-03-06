export interface IExperiment {
  variations: IVariation[];
  data: any;

  id(): string;
  googleId(): string;
  name(): string;
}

export interface IVariation {
  data: any;

  id(): string;
  ref(): string;
  label(): string;
}

export interface IExperiments {
  drafts: IExperiment[];
  running: IExperiment[];

  current(): IExperiment | null;
  refFromCookie(cookie: string): string | null;
}

export class Variation implements IVariation {
  data: any = {};

  constructor(data: any) {
    this.data = data;
  }

  id(): string {
    return this.data.id;
  }

  ref(): string {
    return this.data.ref;
  }

  label(): string {
    return this.data.label;
  }
}

export class Experiment implements IExperiment {
  variations: IVariation[];
  data: any = {};

  constructor(data: any) {
    this.data = data;
    this.variations = (data.variations || []).map((v: any) => {
      new Variation(v);
    });
  }

  id(): string {
    return this.data.id;
  }

  googleId(): string {
    return this.data.ref;
  }

  name(): string {
    return this.data.label;
  }
}
export class Experiments {
  drafts: IExperiment[];
  running: IExperiment[];

  constructor(data: any) {
    if(data) {
      this.drafts = (data.drafts || []).map((exp: any) => {
        new Experiment(exp);
      });
      this.running = (data.running || []).map((exp: any) => {
        new Experiment(exp);
      });
    }
  }

  current(): IExperiment | null {
    return this.running.length > 0 ? this.running[0] : null;
  }
  refFromCookie(cookie: string): string | null {
    if (!cookie || cookie.trim() === "") return null;
    const splitted = cookie.trim().split(" ");
    if (splitted.length < 2) return null;
    const expId = splitted[0];
    const varIndex = parseInt(splitted[1], 10);
    const exp = this.running.filter(function(exp) {
      return exp.googleId() == expId && exp.variations.length > varIndex;
    })[0];
    return exp ? exp.variations[varIndex].ref() : null;
  }
}

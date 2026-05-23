// ─────────────────────────────────────────────────────────────────────────────
// F1 World Championship Archive (1950 – 2025)
// Hardcoded historical data — verified against the official FIA records.
// Used by the /records page in place of live Jolpica calls because the
// archive is immutable history and per-season fetching is unreliable at
// build time.
// ─────────────────────────────────────────────────────────────────────────────

export interface SeasonDriverChampion {
  year: number;
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  /** Primary constructor for the title-winning season. */
  constructor: string;
}

export interface SeasonConstructorChampion {
  year: number;
  constructorId: string;
  name: string;
  nationality: string;
}

// ─── Drivers' Champions ─────────────────────────────────────────────────────
export const DRIVER_CHAMPIONS: SeasonDriverChampion[] = [
  { year: 1950, driverId: "farina",       givenName: "Giuseppe",     familyName: "Farina",       nationality: "Italian",       constructor: "Alfa Romeo" },
  { year: 1951, driverId: "fangio",       givenName: "Juan",         familyName: "Fangio",       nationality: "Argentine",     constructor: "Alfa Romeo" },
  { year: 1952, driverId: "ascari",       givenName: "Alberto",      familyName: "Ascari",       nationality: "Italian",       constructor: "Ferrari" },
  { year: 1953, driverId: "ascari",       givenName: "Alberto",      familyName: "Ascari",       nationality: "Italian",       constructor: "Ferrari" },
  { year: 1954, driverId: "fangio",       givenName: "Juan",         familyName: "Fangio",       nationality: "Argentine",     constructor: "Mercedes" },
  { year: 1955, driverId: "fangio",       givenName: "Juan",         familyName: "Fangio",       nationality: "Argentine",     constructor: "Mercedes" },
  { year: 1956, driverId: "fangio",       givenName: "Juan",         familyName: "Fangio",       nationality: "Argentine",     constructor: "Ferrari" },
  { year: 1957, driverId: "fangio",       givenName: "Juan",         familyName: "Fangio",       nationality: "Argentine",     constructor: "Maserati" },
  { year: 1958, driverId: "hawthorn",     givenName: "Mike",         familyName: "Hawthorn",     nationality: "British",       constructor: "Ferrari" },
  { year: 1959, driverId: "brabham",      givenName: "Jack",         familyName: "Brabham",      nationality: "Australian",    constructor: "Cooper" },
  { year: 1960, driverId: "brabham",      givenName: "Jack",         familyName: "Brabham",      nationality: "Australian",    constructor: "Cooper" },
  { year: 1961, driverId: "phill",        givenName: "Phil",         familyName: "Hill",         nationality: "American",      constructor: "Ferrari" },
  { year: 1962, driverId: "ghill",        givenName: "Graham",       familyName: "Hill",         nationality: "British",       constructor: "BRM" },
  { year: 1963, driverId: "clark",        givenName: "Jim",          familyName: "Clark",        nationality: "British",       constructor: "Lotus" },
  { year: 1964, driverId: "surtees",      givenName: "John",         familyName: "Surtees",      nationality: "British",       constructor: "Ferrari" },
  { year: 1965, driverId: "clark",        givenName: "Jim",          familyName: "Clark",        nationality: "British",       constructor: "Lotus" },
  { year: 1966, driverId: "brabham",      givenName: "Jack",         familyName: "Brabham",      nationality: "Australian",    constructor: "Brabham" },
  { year: 1967, driverId: "hulme",        givenName: "Denny",        familyName: "Hulme",        nationality: "New Zealander", constructor: "Brabham" },
  { year: 1968, driverId: "ghill",        givenName: "Graham",       familyName: "Hill",         nationality: "British",       constructor: "Lotus" },
  { year: 1969, driverId: "stewart",      givenName: "Jackie",       familyName: "Stewart",      nationality: "British",       constructor: "Matra" },
  { year: 1970, driverId: "rindt",        givenName: "Jochen",       familyName: "Rindt",        nationality: "Austrian",      constructor: "Lotus" },
  { year: 1971, driverId: "stewart",      givenName: "Jackie",       familyName: "Stewart",      nationality: "British",       constructor: "Tyrrell" },
  { year: 1972, driverId: "fittipaldi",   givenName: "Emerson",      familyName: "Fittipaldi",   nationality: "Brazilian",     constructor: "Lotus" },
  { year: 1973, driverId: "stewart",      givenName: "Jackie",       familyName: "Stewart",      nationality: "British",       constructor: "Tyrrell" },
  { year: 1974, driverId: "fittipaldi",   givenName: "Emerson",      familyName: "Fittipaldi",   nationality: "Brazilian",     constructor: "McLaren" },
  { year: 1975, driverId: "lauda",        givenName: "Niki",         familyName: "Lauda",        nationality: "Austrian",      constructor: "Ferrari" },
  { year: 1976, driverId: "hunt",         givenName: "James",        familyName: "Hunt",         nationality: "British",       constructor: "McLaren" },
  { year: 1977, driverId: "lauda",        givenName: "Niki",         familyName: "Lauda",        nationality: "Austrian",      constructor: "Ferrari" },
  { year: 1978, driverId: "andretti",     givenName: "Mario",        familyName: "Andretti",     nationality: "American",      constructor: "Lotus" },
  { year: 1979, driverId: "scheckter",    givenName: "Jody",         familyName: "Scheckter",    nationality: "South African", constructor: "Ferrari" },
  { year: 1980, driverId: "ajones",       givenName: "Alan",         familyName: "Jones",        nationality: "Australian",    constructor: "Williams" },
  { year: 1981, driverId: "piquet",       givenName: "Nelson",       familyName: "Piquet",       nationality: "Brazilian",     constructor: "Brabham" },
  { year: 1982, driverId: "rosberg_sr",   givenName: "Keke",         familyName: "Rosberg",      nationality: "Finnish",       constructor: "Williams" },
  { year: 1983, driverId: "piquet",       givenName: "Nelson",       familyName: "Piquet",       nationality: "Brazilian",     constructor: "Brabham" },
  { year: 1984, driverId: "lauda",        givenName: "Niki",         familyName: "Lauda",        nationality: "Austrian",      constructor: "McLaren" },
  { year: 1985, driverId: "prost",        givenName: "Alain",        familyName: "Prost",        nationality: "French",        constructor: "McLaren" },
  { year: 1986, driverId: "prost",        givenName: "Alain",        familyName: "Prost",        nationality: "French",        constructor: "McLaren" },
  { year: 1987, driverId: "piquet",       givenName: "Nelson",       familyName: "Piquet",       nationality: "Brazilian",     constructor: "Williams" },
  { year: 1988, driverId: "senna",        givenName: "Ayrton",       familyName: "Senna",        nationality: "Brazilian",     constructor: "McLaren" },
  { year: 1989, driverId: "prost",        givenName: "Alain",        familyName: "Prost",        nationality: "French",        constructor: "McLaren" },
  { year: 1990, driverId: "senna",        givenName: "Ayrton",       familyName: "Senna",        nationality: "Brazilian",     constructor: "McLaren" },
  { year: 1991, driverId: "senna",        givenName: "Ayrton",       familyName: "Senna",        nationality: "Brazilian",     constructor: "McLaren" },
  { year: 1992, driverId: "mansell",      givenName: "Nigel",        familyName: "Mansell",      nationality: "British",       constructor: "Williams" },
  { year: 1993, driverId: "prost",        givenName: "Alain",        familyName: "Prost",        nationality: "French",        constructor: "Williams" },
  { year: 1994, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Benetton" },
  { year: 1995, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Benetton" },
  { year: 1996, driverId: "dhill",        givenName: "Damon",        familyName: "Hill",         nationality: "British",       constructor: "Williams" },
  { year: 1997, driverId: "villeneuve",   givenName: "Jacques",      familyName: "Villeneuve",   nationality: "Canadian",      constructor: "Williams" },
  { year: 1998, driverId: "hakkinen",     givenName: "Mika",         familyName: "Häkkinen",     nationality: "Finnish",       constructor: "McLaren" },
  { year: 1999, driverId: "hakkinen",     givenName: "Mika",         familyName: "Häkkinen",     nationality: "Finnish",       constructor: "McLaren" },
  { year: 2000, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Ferrari" },
  { year: 2001, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Ferrari" },
  { year: 2002, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Ferrari" },
  { year: 2003, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Ferrari" },
  { year: 2004, driverId: "schumacher",   givenName: "Michael",      familyName: "Schumacher",   nationality: "German",        constructor: "Ferrari" },
  { year: 2005, driverId: "alonso",       givenName: "Fernando",     familyName: "Alonso",       nationality: "Spanish",       constructor: "Renault" },
  { year: 2006, driverId: "alonso",       givenName: "Fernando",     familyName: "Alonso",       nationality: "Spanish",       constructor: "Renault" },
  { year: 2007, driverId: "raikkonen",    givenName: "Kimi",         familyName: "Räikkönen",    nationality: "Finnish",       constructor: "Ferrari" },
  { year: 2008, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "McLaren" },
  { year: 2009, driverId: "button",       givenName: "Jenson",       familyName: "Button",       nationality: "British",       constructor: "Brawn" },
  { year: 2010, driverId: "vettel",       givenName: "Sebastian",    familyName: "Vettel",       nationality: "German",        constructor: "Red Bull" },
  { year: 2011, driverId: "vettel",       givenName: "Sebastian",    familyName: "Vettel",       nationality: "German",        constructor: "Red Bull" },
  { year: 2012, driverId: "vettel",       givenName: "Sebastian",    familyName: "Vettel",       nationality: "German",        constructor: "Red Bull" },
  { year: 2013, driverId: "vettel",       givenName: "Sebastian",    familyName: "Vettel",       nationality: "German",        constructor: "Red Bull" },
  { year: 2014, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2015, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2016, driverId: "nrosberg",     givenName: "Nico",         familyName: "Rosberg",      nationality: "German",        constructor: "Mercedes" },
  { year: 2017, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2018, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2019, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2020, driverId: "hamilton",     givenName: "Lewis",        familyName: "Hamilton",     nationality: "British",       constructor: "Mercedes" },
  { year: 2021, driverId: "verstappen",   givenName: "Max",          familyName: "Verstappen",   nationality: "Dutch",         constructor: "Red Bull" },
  { year: 2022, driverId: "verstappen",   givenName: "Max",          familyName: "Verstappen",   nationality: "Dutch",         constructor: "Red Bull" },
  { year: 2023, driverId: "verstappen",   givenName: "Max",          familyName: "Verstappen",   nationality: "Dutch",         constructor: "Red Bull" },
  { year: 2024, driverId: "verstappen",   givenName: "Max",          familyName: "Verstappen",   nationality: "Dutch",         constructor: "Red Bull" },
  { year: 2025, driverId: "norris",       givenName: "Lando",        familyName: "Norris",       nationality: "British",       constructor: "McLaren" },
];

// ─── Constructors' Champions (the title started in 1958) ────────────────────
export const CONSTRUCTOR_CHAMPIONS: SeasonConstructorChampion[] = [
  { year: 1958, constructorId: "vanwall",    name: "Vanwall",        nationality: "British" },
  { year: 1959, constructorId: "cooper",     name: "Cooper-Climax",  nationality: "British" },
  { year: 1960, constructorId: "cooper",     name: "Cooper-Climax",  nationality: "British" },
  { year: 1961, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1962, constructorId: "brm",        name: "BRM",            nationality: "British" },
  { year: 1963, constructorId: "lotus",      name: "Lotus-Climax",   nationality: "British" },
  { year: 1964, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1965, constructorId: "lotus",      name: "Lotus-Climax",   nationality: "British" },
  { year: 1966, constructorId: "brabham",    name: "Brabham-Repco",  nationality: "British" },
  { year: 1967, constructorId: "brabham",    name: "Brabham-Repco",  nationality: "British" },
  { year: 1968, constructorId: "lotus",      name: "Lotus-Ford",     nationality: "British" },
  { year: 1969, constructorId: "matra",      name: "Matra-Ford",     nationality: "French" },
  { year: 1970, constructorId: "lotus",      name: "Lotus-Ford",     nationality: "British" },
  { year: 1971, constructorId: "tyrrell",    name: "Tyrrell-Ford",   nationality: "British" },
  { year: 1972, constructorId: "lotus",      name: "Lotus-Ford",     nationality: "British" },
  { year: 1973, constructorId: "lotus",      name: "Lotus-Ford",     nationality: "British" },
  { year: 1974, constructorId: "mclaren",    name: "McLaren-Ford",   nationality: "British" },
  { year: 1975, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1976, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1977, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1978, constructorId: "lotus",      name: "Lotus-Ford",     nationality: "British" },
  { year: 1979, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1980, constructorId: "williams",   name: "Williams-Ford",  nationality: "British" },
  { year: 1981, constructorId: "williams",   name: "Williams-Ford",  nationality: "British" },
  { year: 1982, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1983, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 1984, constructorId: "mclaren",    name: "McLaren-TAG",    nationality: "British" },
  { year: 1985, constructorId: "mclaren",    name: "McLaren-TAG",    nationality: "British" },
  { year: 1986, constructorId: "williams",   name: "Williams-Honda", nationality: "British" },
  { year: 1987, constructorId: "williams",   name: "Williams-Honda", nationality: "British" },
  { year: 1988, constructorId: "mclaren",    name: "McLaren-Honda",  nationality: "British" },
  { year: 1989, constructorId: "mclaren",    name: "McLaren-Honda",  nationality: "British" },
  { year: 1990, constructorId: "mclaren",    name: "McLaren-Honda",  nationality: "British" },
  { year: 1991, constructorId: "mclaren",    name: "McLaren-Honda",  nationality: "British" },
  { year: 1992, constructorId: "williams",   name: "Williams-Renault", nationality: "British" },
  { year: 1993, constructorId: "williams",   name: "Williams-Renault", nationality: "British" },
  { year: 1994, constructorId: "williams",   name: "Williams-Renault", nationality: "British" },
  { year: 1995, constructorId: "benetton",   name: "Benetton-Renault", nationality: "British" },
  { year: 1996, constructorId: "williams",   name: "Williams-Renault", nationality: "British" },
  { year: 1997, constructorId: "williams",   name: "Williams-Renault", nationality: "British" },
  { year: 1998, constructorId: "mclaren",    name: "McLaren-Mercedes", nationality: "British" },
  { year: 1999, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2000, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2001, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2002, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2003, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2004, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2005, constructorId: "renault",    name: "Renault",        nationality: "French" },
  { year: 2006, constructorId: "renault",    name: "Renault",        nationality: "French" },
  { year: 2007, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2008, constructorId: "ferrari",    name: "Ferrari",        nationality: "Italian" },
  { year: 2009, constructorId: "brawn",      name: "Brawn-Mercedes", nationality: "British" },
  { year: 2010, constructorId: "red_bull",   name: "Red Bull-Renault", nationality: "Austrian" },
  { year: 2011, constructorId: "red_bull",   name: "Red Bull-Renault", nationality: "Austrian" },
  { year: 2012, constructorId: "red_bull",   name: "Red Bull-Renault", nationality: "Austrian" },
  { year: 2013, constructorId: "red_bull",   name: "Red Bull-Renault", nationality: "Austrian" },
  { year: 2014, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2015, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2016, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2017, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2018, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2019, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2020, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2021, constructorId: "mercedes",   name: "Mercedes",       nationality: "German" },
  { year: 2022, constructorId: "red_bull",   name: "Red Bull-RBPT",  nationality: "Austrian" },
  { year: 2023, constructorId: "red_bull",   name: "Red Bull-Honda RBPT", nationality: "Austrian" },
  { year: 2024, constructorId: "mclaren",    name: "McLaren-Mercedes", nationality: "British" },
  { year: 2025, constructorId: "mclaren",    name: "McLaren-Mercedes", nationality: "British" },
];

// ─── Aggregation helpers ────────────────────────────────────────────────────
export interface DriverHallEntry {
  driverId: string;
  name: string;
  nationality: string;
  titles: number;
  teams: string[];
  years: number[];
}

export interface ConstructorHallEntry {
  constructorId: string;
  name: string;
  /** Cleaner display name with engine suffix stripped (e.g. "Ferrari", "McLaren"). */
  displayName: string;
  nationality: string;
  titles: number;
  years: number[];
}

/** Strip "-Engine" suffix and trailing variants so dynasty cards read cleanly. */
function cleanConstructorName(name: string): string {
  return name.replace(/-.*$/, "").trim();
}

/** Aggregate driver champions into a Hall of Fame sorted by titles desc. */
export function getDriverHallOfFame(): DriverHallEntry[] {
  const map = new Map<string, DriverHallEntry>();
  for (const c of DRIVER_CHAMPIONS) {
    const existing = map.get(c.driverId);
    if (existing) {
      existing.titles += 1;
      if (!existing.teams.includes(c.constructor)) existing.teams.push(c.constructor);
      existing.years.push(c.year);
    } else {
      map.set(c.driverId, {
        driverId: c.driverId,
        name: `${c.givenName} ${c.familyName}`,
        nationality: c.nationality,
        titles: 1,
        teams: [c.constructor],
        years: [c.year],
      });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => b.titles - a.titles || a.years[0] - b.years[0]
  );
}

/** Aggregate constructor champions into a dynasty list sorted by titles desc. */
export function getConstructorHallOfFame(): ConstructorHallEntry[] {
  const map = new Map<string, ConstructorHallEntry>();
  for (const c of CONSTRUCTOR_CHAMPIONS) {
    const existing = map.get(c.constructorId);
    if (existing) {
      existing.titles += 1;
      existing.years.push(c.year);
    } else {
      map.set(c.constructorId, {
        constructorId: c.constructorId,
        name: c.name,
        displayName: cleanConstructorName(c.name),
        nationality: c.nationality,
        titles: 1,
        years: [c.year],
      });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => b.titles - a.titles || a.years[0] - b.years[0]
  );
}

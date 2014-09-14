var partyMap = {
  socialDemocrat: {
    abbreviation: 'SD',
    name: 'Social Democrat',
    color: '#FB5258'
  },
  conservative: {
    abbreviation: 'C',
    name: 'Conservative',
    color: '#777777'
  },
  green: {
    abbreviation: 'G',
    name: 'Green',
    color: '#BBDF2A'
  },
  nationalist: {
    abbreviation: 'N',
    name: 'Nationalist',
    color: '#46C8B3'
  },
  liberal: {
    abbreviation: 'L',
    name: 'Liberal',
    color: '#F8DB3B',
  }
};

export default function lookupType(key, type) {
  if (typeof partyMap[key] === 'undefined') {
    return;
  }

  return partyMap[key][type];
}

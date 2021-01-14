export const settings = {
  tagTextProp: 'value',
  placeholder: '',
  delimiters: ',',
  pattern: null,
  mode: null,
  mixTagsInterpolator: ['[[', ']]'],
  mixTagsAllowedAfter: /,|\.|\:|\s/,
  duplicates: false,
  trim: true,
  enforceWhitelist: false,
  autoComplete: {
    enabled: true,
    rightKey: false
  },
  whitelist: [],
  blacklist: [],
  addTagOnBlur: true,
  callbacks: {}
}

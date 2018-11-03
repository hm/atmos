import upperFirst from 'lodash/upperFirst'
const requireModule = require.context('../components', true, /\.vue$/)
const modules = {}

requireModule.keys().forEach(fileName => {
  let moduleName = fileName.split('/')
  moduleName = moduleName[moduleName.length - 1].replace(/(\.\/|\.vue)/g, '')
  moduleName = upperFirst(moduleName)
  modules[moduleName] = requireModule(fileName).default
})

export default modules

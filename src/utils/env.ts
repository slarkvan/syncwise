export function isProduction() {
    console.log("import.meta.env", import.meta.env)
    return !import.meta.env.DEV
  }
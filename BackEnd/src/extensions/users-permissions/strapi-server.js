module.exports = (plugin) => {
  // console.log(JSON.stringify(plugin))
  for (let i = 0; i < plugin.routes["content-api"].routes.length; i++) {
    if (
      plugin.routes["content-api"].routes[i].path === "/auth/local/register"
    ) {
      if (
        plugin.routes["content-api"].routes[i].config.policies === undefined
      ) {
        plugin.routes["content-api"].routes[i].config.policies = [
          "global::validate-fields",
        ];
      } else {
        plugin.routes["content-api"].routes[i].config.policies.push(
          "global::validate-fields"
        );
      }
    }
  }
  strapi.log.info("\nadded policy: global::validate-fields to /auth/local/register route\n");
  return plugin;
};

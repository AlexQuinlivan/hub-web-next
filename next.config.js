/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    STORYPARK_OIDC_PROVIDER_ID: "storypark-clone", // maps to redirect uri path partial
    STORYPARK_OIDC_ISSUER: "https://clone.storypark.com", // nb: strictly no trailing '/'
    STORYPARK_OIDC_CLIENT_ID: "h2hhnRl34lFwFe-h_V3akL0S4XY0kwgPSe4WLC4IHpY",
    STORYPARK_OIDC_CLIENT_SECRET: "Q_yZj3U49Bn3Vdpf9e-e-318iC0J6SQ7Mc35rUvAK38",
    STORYPARK_OIDC_SCOPES: "openid profile",
    NEXTAUTH_SECRET: "d8FCXllqm6/qNMncEEx9g+MA+EphcalmuPuac3+00uE=",
    NEXTAUTH_URL: "https://localhost:3000"
  }
}

module.exports = nextConfig

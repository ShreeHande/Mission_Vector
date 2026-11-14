// NASA/JPL reference physical constants. GM: JPL DE440 astrodynamic parameters;
// radii: JPL planetary physical parameters and planetary satellite physical parameters.
// Sources: https://ssd.jpl.nasa.gov/astro_par.html
// https://ssd.jpl.nasa.gov/planets/phys_par.html
// https://ssd.jpl.nasa.gov/sats/phys_par/
// SI units throughout, unless otherwise specified.
export const NASA_BODIES=Object.freeze({
 Earth:Object.freeze({mu_m3_s2:398600.435507e9,radius_m:6371.0084e3, radius_note:'IUGG mean Earth radius, approximate; not JPL radius',source:'JPL DE440 GM; IUGG radius'}),
 Moon:Object.freeze({mu_m3_s2:4902.800118e9,radius_m:1737.4e3,source:'JPL DE440 GM; JPL satellite physical parameters mean radius'}),
 Mars:Object.freeze({mu_m3_s2:42828.375816e9,radius_m:3389.5e3,source:'JPL DE440 Mars-system GM; approximate Mars mean radius'})
});
export const NASA_AU_M=149597870700;
export const NASA_SOLAR_CONSTANT_W_M2=1361; // Common nominal irradiance at 1 AU; time-varying in reality.
export function nasaOrbit(bodyName,altitude_m){
 const b=NASA_BODIES[bodyName];if(!b||!Number.isFinite(altitude_m)||altitude_m<0)throw Error('Invalid body or altitude');
 const r=b.radius_m+altitude_m,mu=b.mu_m3_s2;
 return {radius_m:r,circular_velocity_ms:Math.sqrt(mu/r),escape_velocity_ms:Math.sqrt(2*mu/r),orbital_period_s:2*Math.PI*Math.sqrt(r*r*r/mu),surface_gravity_ms2:mu/(b.radius_m*b.radius_m),orbital_gravity_ms2:mu/(r*r)};
}
export function solarFluxAtAU(distanceAU){if(!Number.isFinite(distanceAU)||distanceAU<=0)throw Error('Invalid heliocentric distance');return NASA_SOLAR_CONSTANT_W_M2/(distanceAU*distanceAU)}

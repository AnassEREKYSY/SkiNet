import{b as u}from"./chunk-SGA2E5VX.js";import{j as o}from"./chunk-SFOYLPVW.js";import{ka as t,r as e,x as n}from"./chunk-LGPVE6LA.js";var A=(m,a)=>{let r=t(u),c=t(o);return r.currentUser()?e(!0):r.getAuthState().pipe(n(i=>i.isAuthenticated?!0:(c.navigate(["/account/login"],{queryParams:{returnUrl:a.url}}),!1)))};export{A as a};

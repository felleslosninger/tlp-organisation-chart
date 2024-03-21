import{r as i,j as t}from"./jsx-runtime-BgQc5Su6.js";import{H as x,u as q,L as p}from"./Link-Beuewr6S.js";import{u as Y,h as Q,j as V,k as ee,n as te,L as j,O as se,M as ne,o as re,S as le}from"./components-BdZnk4IM.js";import{$ as C,c as u,P as _}from"./Paragraph-DUuRt2MA.js";import{M as ie}from"./index-D_pZd4SX.js";import{u as I}from"./useId-CbeXp8sa.js";/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let H="positions";function ae({getKey:s,...e}){let{isSpaMode:r}=Y(),n=Q(),l=V();ee({getKey:s,storageKey:H});let a=i.useMemo(()=>{if(!s)return null;let f=s(n,l);return f!==n.key?f:null},[]);if(r)return null;let m=((f,y)=>{if(!window.history.state||!window.history.state.key){let v=Math.random().toString(32).slice(2);window.history.replaceState({key:v},"")}try{let L=JSON.parse(sessionStorage.getItem(f)||"{}")[y||window.history.state.key];typeof L=="number"&&window.scrollTo(0,L)}catch(v){console.error(v),sessionStorage.removeItem(f)}}).toString();return i.createElement("script",te({},e,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${m})(${JSON.stringify(H)}, ${JSON.stringify(a)})`}}))}function z(s){var e,r,n="";if(typeof s=="string"||typeof s=="number")n+=s;else if(typeof s=="object")if(Array.isArray(s)){var l=s.length;for(e=0;e<l;e++)s[e]&&(r=z(s[e]))&&(n&&(n+=" "),n+=r)}else for(r in s)s[r]&&(n&&(n+=" "),n+=r);return n}function w(){for(var s,e,r=0,n="",l=arguments.length;r<l;r++)(s=arguments[r])&&(e=z(s))&&(n&&(n+=" "),n+=e);return n}const oe="_container_7hcmf_1",de={container:oe},$=({children:s,className:e,...r})=>t.jsx("div",{className:w(de.container,e),...r,children:s}),N=i.createContext({size:"medium",headingId:"heading",setHeadingId:()=>{}}),M=i.forwardRef(({asChild:s,size:e="medium",...r},n)=>{const[l,a]=i.useState(),m=s?C:"div";return t.jsx(N.Provider,{value:{size:e,headingId:l,setHeadingId:a},children:t.jsx(m,{ref:n,...r})})});M.displayName="ListRoot";var O={small:"fds-list-small-f2433af",medium:"fds-list-medium-f2433af",large:"fds-list-large-f2433af",listItem:"fds-list-listItem-f2433af",heading:"fds-list-heading-f2433af"};const B=i.forwardRef(({asChild:s,className:e,...r},n)=>{const l=s?C:"li";return t.jsx(l,{className:u(O.listItem,e),...r,ref:n})});B.displayName="ListItem";const ce={small:"xxsmall",medium:"xsmall",large:"small"},P=i.forwardRef(({level:s=2,id:e,...r},n)=>{const{size:l,headingId:a,setHeadingId:m}=i.useContext(N),f=i.useId(),y=e??f,v=i.useMemo(()=>ce[l],[l]);return i.useEffect(()=>{a!==y&&m(y)},[a,e,m,y]),t.jsx(x,{ref:n,size:v,id:a,level:s,spacing:!0,...r})});P.displayName="ListHeading";const D=i.forwardRef(({asChild:s,...e},r)=>{const{size:n,headingId:l}=i.useContext(N),a=s?C:"ul";return t.jsx(_,{size:n,asChild:!0,children:t.jsx(a,{className:u(O[n],e.className),...l?{"aria-labelledby":l}:{},ref:r,...e})})});D.displayName="ListUnordered";const U=i.forwardRef(({asChild:s,...e},r)=>{const{size:n,headingId:l}=i.useContext(N),a=s?C:"ol";return t.jsx(_,{size:n,asChild:!0,children:t.jsx(a,{className:u(O[n],e.className),...l?{"aria-labelledby":l}:{},ref:r,...e})})});U.displayName="ListOrdered";const c={};c.Root=M;c.Item=B;c.Heading=P;c.Ordered=U;c.Unordered=D;c.Root.displayName="List.Root";c.Item.displayName="List.Item";c.Heading.displayName="List.Heading";c.Ordered.displayName="List.Ordered";c.Unordered.displayName="List.Unordered";const fe=typeof window<"u"?i.useLayoutEffect:i.useEffect;var b={spinner:"fds-spinner-spinner-ecd53b7b","rotate-animation":"fds-spinner-rotate-animation-ecd53b7b",spinnerCircle:"fds-spinner-spinnerCircle-ecd53b7b","stroke-animation":"fds-spinner-stroke-animation-ecd53b7b",default:"fds-spinner-default-ecd53b7b",interaction:"fds-spinner-interaction-ecd53b7b",inverted:"fds-spinner-inverted-ecd53b7b",background:"fds-spinner-background-ecd53b7b",invertedBackground:"fds-spinner-invertedBackground-ecd53b7b"};const k={};function S(s){const e=i.useRef(null);return fe(()=>{const r=document.getAnimations().filter(l=>"animationName"in l&&l.animationName===s),n=r.find(l=>{var a;return((a=l.effect)==null?void 0:a.target)===e.current});return n&&n===r[0]&&k[s]&&(n.currentTime=k[s]),n&&n!==r[0]&&(n.currentTime=r[0].currentTime),()=>{n&&n===r[0]&&(k[s]=n.currentTime)}},[s]),e}const E={xxsmall:13,xsmall:20,small:27,medium:40,large:56,xlarge:79},Z=({title:s,size:e="medium",variant:r="default",className:n,style:l,...a})=>{const m=S(b["rotate-animation"]),f=S(b["stroke-animation"]);return t.jsxs("svg",{className:u(b.spinner,n),style:{width:E[e],height:E[e],...l},viewBox:"0 0 50 50",ref:m,...a,children:[t.jsx("title",{children:s}),t.jsx("circle",{className:u(b.background,r==="inverted"&&b.invertedBackground),cx:"25",cy:"25",r:"20",fill:"none",strokeWidth:"5"}),t.jsx("circle",{className:u(b.spinnerCircle,b[r]),cx:"25",cy:"25",r:"20",fill:"none",strokeWidth:"5",ref:f})]})};Z.displayName="Spinner";var me=function(s,e){var r={};for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&e.indexOf(n)<0&&(r[n]=s[n]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(s);l<n.length;l++)e.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(s,n[l])&&(r[n[l]]=s[n[l]]);return r};const ue=i.forwardRef((s,e)=>{var{title:r,titleId:n}=s,l=me(s,["title","titleId"]);let a=I();return a=r?n||"title-"+a:void 0,i.createElement("svg",Object.assign({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:!1,role:"img",ref:e,"aria-labelledby":a},l),r?i.createElement("title",{id:a},r):null,i.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M5.97 9.47a.75.75 0 0 1 1.06 0L12 14.44l4.97-4.97a.75.75 0 1 1 1.06 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-5.5-5.5a.75.75 0 0 1 0-1.06Z",fill:"currentColor"}))}),he=ue;var ge=function(s,e){var r={};for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&e.indexOf(n)<0&&(r[n]=s[n]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(s);l<n.length;l++)e.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(s,n[l])&&(r[n[l]]=s[n[l]]);return r};const xe=i.forwardRef((s,e)=>{var{title:r,titleId:n}=s,l=ge(s,["title","titleId"]);let a=I();return a=r?n||"title-"+a:void 0,i.createElement("svg",Object.assign({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:!1,role:"img",ref:e,"aria-labelledby":a},l),r?i.createElement("title",{id:a},r):null,i.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M11.47 7.97a.75.75 0 0 1 1.06 0l5.5 5.5a.75.75 0 1 1-1.06 1.06L12 9.56l-4.97 4.97a.75.75 0 0 1-1.06-1.06l5.5-5.5Z",fill:"currentColor"}))}),pe=xe;var be=function(s,e){var r={};for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&e.indexOf(n)<0&&(r[n]=s[n]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(s);l<n.length;l++)e.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(s,n[l])&&(r[n[l]]=s[n[l]]);return r};const je=i.forwardRef((s,e)=>{var{title:r,titleId:n}=s,l=be(s,["title","titleId"]);let a=I();return a=r?n||"title-"+a:void 0,i.createElement("svg",Object.assign({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:!1,role:"img",ref:e,"aria-labelledby":a},l),r?i.createElement("title",{id:a},r):null,i.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.53 4.47a.75.75 0 0 0-1.06 0l-3.5 3.5a.75.75 0 0 0 1.06 1.06L12 6.06l2.97 2.97a.75.75 0 1 0 1.06-1.06l-3.5-3.5Zm-3.5 10.5a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06L12 17.94l-2.97-2.97Z",fill:"currentColor"}))}),ve=je;var T={divider:"fds-divider-divider-72ee397b",default:"fds-divider-default-72ee397b",strong:"fds-divider-strong-72ee397b",subtle:"fds-divider-subtle-72ee397b"};const R=i.forwardRef(({color:s="default",className:e,...r},n)=>t.jsx("hr",{className:u(T.divider,T[s],e),ref:n,...r}));R.displayName="Divider";R.displayName="Divider";var h={table:"fds-table-table-c4ff6291",stickyHeader:"fds-table-stickyHeader-c4ff6291",border:"fds-table-border-c4ff6291",row:"fds-table-row-c4ff6291",small:"fds-table-small-c4ff6291",medium:"fds-table-medium-c4ff6291",large:"fds-table-large-c4ff6291",head:"fds-table-head-c4ff6291",headerCell:"fds-table-headerCell-c4ff6291",sortable:"fds-table-sortable-c4ff6291",sorted:"fds-table-sorted-c4ff6291",cell:"fds-table-cell-c4ff6291",zebra:"fds-table-zebra-c4ff6291"};const A=i.forwardRef(({zebra:s=!1,size:e="medium",stickyHeader:r=!1,border:n=!1,className:l,children:a,...m},f)=>t.jsx(_,{asChild:!0,size:e,children:t.jsx("table",{ref:f,className:u(h[e],s&&h.zebra,r&&h.stickyHeader,n&&h.border,h.table,l),...m,children:a})}));A.displayName="Table";const W=i.forwardRef(({className:s,children:e,...r},n)=>t.jsx("thead",{ref:n,className:u(h.head,s),...r,children:e}));W.displayName="TableHead";const G=i.forwardRef(({children:s,...e},r)=>t.jsx("tbody",{ref:r,...e,children:s}));G.displayName="TableBody";const J=i.forwardRef(({className:s,children:e,...r},n)=>t.jsx("tr",{className:u(h.row,s),ref:n,...r,children:e}));J.displayName="TableRow";const F=i.forwardRef(({className:s,children:e,...r},n)=>t.jsx("td",{ref:n,className:u(h.cell,s),...r,children:e}));F.displayName="TableCell";const we={ascending:t.jsx(pe,{}),descending:t.jsx(he,{})},K=i.forwardRef(({sortable:s=!1,sort:e,onSortClick:r,className:n,children:l,...a},m)=>{const f=e==="ascending"||e==="descending"?we[e]:t.jsx(ve,{});return t.jsxs("th",{className:u(s&&h.sortable,e&&h.sorted,h.headerCell,n),"aria-sort":e,ref:m,...a,children:[s&&t.jsxs("button",{className:q.focusable,onClick:r,children:[l,f]}),!s&&l]})});K.displayName="TableHeaderCell";const o=A;o.Head=W;o.Body=G;o.Row=J;o.Cell=F;o.HeaderCell=K;o.displayName="Table";o.Head.displayName="Table.Head";o.Body.displayName="Table.Body";o.Row.displayName="Table.Row";o.Cell.displayName="Table.Cell";o.HeaderCell.displayName="Table.HeaderCell";function ye(){return t.jsx("svg",{width:"1024",height:"1024",viewBox:"0 0 1024 1024",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z",transform:"scale(64)",fill:"#1B1F23"})})}const _e="_header_6phxo_1",Ce="_container_6phxo_7",Ne="_logo_6phxo_15",ke="_logoLink_6phxo_20",Ie="_toggle_6phxo_25",Oe="_menu_6phxo_32",Re="_item_6phxo_38",Le="_link_6phxo_43",He="_itemIcon_6phxo_56",Se="_firstIcon_6phxo_60",Ee="_linkIcon_6phxo_64",Te="_github_6phxo_75",ze="_active_6phxo_83",d={header:_e,container:Ce,logo:Ne,logoLink:ke,toggle:Ie,menu:Oe,item:Re,link:Le,itemIcon:He,firstIcon:Se,linkIcon:Ee,github:Te,active:ze};function X(s,e){if(s==null)return{};var r={},n=Object.keys(s),l,a;for(a=0;a<n.length;a++)l=n[a],!(e.indexOf(l)>=0)&&(r[l]=s[l]);return r}var $e=["color"],Me=i.forwardRef(function(s,e){var r=s.color,n=r===void 0?"currentColor":r,l=X(s,$e);return i.createElement("svg",Object.assign({width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l,{ref:e}),i.createElement("path",{d:"M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z",fill:n,fillRule:"evenodd",clipRule:"evenodd"}))}),Be=["color"],Pe=i.forwardRef(function(s,e){var r=s.color,n=r===void 0?"currentColor":r,l=X(s,Be);return i.createElement("svg",Object.assign({width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l,{ref:e}),i.createElement("path",{d:"M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z",fill:n,fillRule:"evenodd",clipRule:"evenodd"}))});const De=()=>{const[s,e]=i.useState(!1);return t.jsx("header",{className:d.header,children:t.jsxs("div",{className:d.container,children:[t.jsx("div",{children:t.jsx(p,{asChild:!0,children:t.jsx(j,{to:"/",children:t.jsx("img",{src:"logo_dark.svg",alt:"Organisation Chart"})})})}),t.jsxs("nav",{className:d.right,children:[t.jsxs("button",{"aria-expanded":s,"aria-label":"Meny",className:d.toggle,onClick:()=>{e(!s)},children:[s&&t.jsx(Me,{}),!s&&t.jsx(Pe,{})]}),t.jsxs("ul",{className:w(d.menu,{[d.active]:s}),children:[t.jsx("li",{className:d.item,children:t.jsx(j,{className:w(d.link),to:"/dokumentasjon",children:"Dokumentasjon"})}),t.jsx("li",{className:d.item,children:t.jsx(j,{className:w(d.link),to:"/endringslogg",children:"Endringslogg"})}),t.jsx("li",{className:w(d.item,d.itemIcon,d.firstIcon),children:t.jsx(p,{href:"https://github.com/felleslosninger/tlp-organization-chart",target:"_blank",title:"Github repository",className:w(d.linkIcon,d.github),children:t.jsx(ye,{})})})]})]})]})})},Ue="_footer_9wagw_1",Ze="_container_9wagw_10",Ae="_title_9wagw_16",We="_logos_9wagw_21",Ge="_links_9wagw_33",Je="_top_9wagw_51",Fe="_bottom_9wagw_55",Ke="_button_9wagw_62",Xe="_text_9wagw_83",qe="_heading_9wagw_88",g={footer:Ue,container:Ze,title:Ae,logos:We,links:Ge,top:Je,bottom:Fe,button:Ke,text:Xe,heading:qe},Ye=()=>t.jsx("footer",{className:g.footer,children:t.jsx("div",{className:g.top,children:t.jsxs($,{className:g.container,children:[t.jsxs("div",{className:g.logos,children:[t.jsx(p,{asChild:!0,children:t.jsx(j,{to:"/",children:t.jsx("img",{src:"logo_white.svg",alt:"Organisation Chart"})})}),t.jsx(_,{size:"small",className:g.text,children:"Et lett og tilgjengelig JavaScript bibliotek for å vise organisasjonskart på nettsider."})]}),t.jsxs("div",{children:[t.jsx(x,{level:2,size:"xsmall",className:g.heading,spacing:!0,children:"Om nettstedet"}),t.jsxs("ul",{className:g.links,children:[t.jsx("li",{children:t.jsx(p,{asChild:!0,inverted:!0,children:t.jsx(j,{to:"/dokumentasjon",children:"Dokumentasjon"})})}),t.jsx("li",{children:t.jsx(p,{asChild:!0,inverted:!0,children:t.jsx(j,{to:"/endringslogg",children:"Endringslogg"})})}),t.jsx("li",{children:t.jsx(p,{asChild:!0,inverted:!0,children:t.jsx(j,{to:"/personvernerklæring",children:"Personvernerklæring"})})})]})]}),t.jsxs("div",{children:[t.jsx(x,{level:2,size:"xsmall",className:g.heading,spacing:!0,children:"Kom i kontakt med oss"}),t.jsx("ul",{className:g.links,children:t.jsx("li",{children:t.jsx(p,{href:"https://github.com/felleslosninger/tlp-organization-chart/issues/new",target:"_blank",inverted:!0,children:"Github issues"})})})]})]})})}),Qe="_content_vrkz1_1",Ve={content:Qe},et=({children:s})=>t.jsx(ie,{components:{h1:e=>t.jsx(x,{level:1,spacing:!0,size:"xlarge",...e}),h2:e=>t.jsx(x,{level:2,spacing:!0,size:"large",...e}),h3:e=>t.jsx(x,{level:3,spacing:!0,size:"medium",...e}),h4:e=>t.jsx(x,{level:4,spacing:!0,size:"small",...e}),h5:e=>t.jsx(x,{level:5,spacing:!0,size:"xsmall",...e}),h6:e=>t.jsx(x,{level:6,spacing:!0,size:"xxsmall",...e}),a:e=>e&&e.href&&e.href.startsWith("http")?t.jsx(p,{...e,target:"_blank"}):t.jsx(p,{...e}),p:_,ol:e=>t.jsx(c.Root,{children:t.jsx(c.Ordered,{...e})}),ul:e=>t.jsx(c.Root,{children:t.jsx(c.Unordered,{...e})}),li:e=>t.jsx(c.Item,{...e}),hr:e=>t.jsx(R,{...e,color:"default",ref:null}),table:e=>t.jsx(o,{...e,zebra:!0,border:!0}),thead:e=>t.jsx(o.Head,{...e}),tbody:e=>t.jsx(o.Body,{...e}),tr:e=>t.jsx(o.Row,{...e}),th:e=>t.jsx(o.HeaderCell,{...e}),td:e=>t.jsx(o.Cell,{...e})},children:t.jsx("div",{className:Ve.content,children:s})});function at({children:s}){return t.jsxs("html",{lang:"no",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx("link",{rel:"stylesheet",href:"/root.css"}),t.jsx("link",{rel:"stylesheet",href:"https://altinncdn.no/fonts/inter/inter.css"}),t.jsx(ne,{}),t.jsx(re,{})]}),t.jsxs("body",{children:[t.jsx(De,{}),t.jsx("main",{children:t.jsx($,{style:{minHeight:"calc(100vh - 100px)",marginTop:"var(--fds-spacing-4)",marginBottom:"var(--fds-spacing-4)"},children:t.jsx(et,{children:s})})}),t.jsx(Ye,{}),t.jsx(ae,{}),t.jsx(le,{})]})]})}function ot(){return t.jsx(se,{})}function dt(){return t.jsx("div",{children:t.jsx(Z,{title:"loading content"})})}export{dt as HydrateFallback,at as Layout,ot as default};
import{r as n,F as i,j as e,I as C,m as N,a as K,g as L,S,B as f,e as w}from"./index-e21e34ca.js";import{u as F}from"./index-8487e073.js";import{a as y}from"./roleApi-4e639a18.js";import{M as T}from"./index-b99730d4.js";import{a as A,T as P}from"./Table-c76cafa9.js";import"./index-6aff964c.js";import"./useBreakpoint-bf3efe0f.js";function E(c){const[d,o]=n.useState(!1),[h,p]=n.useState("create"),[s]=i.useForm();n.useImperativeHandle(c.mRef,()=>({open:j}));const j=(m,r)=>{p(m),o(!0),r&&s.setFieldsValue(r)},l=async()=>{if(await s.validateFields()){const r=s.getFieldsValue();h==="create"?await y.createRole(r):await y.editRole(r),N.success("操作成功"),x(),c.update()}},x=()=>{s.resetFields(),o(!1)};return e.jsx(T,{title:h==="create"?"新增角色":"編輯角色",width:600,open:d,okText:"確定",cancelText:"取消",onOk:l,onCancel:x,children:e.jsxs(i,{form:s,labelAlign:"right",labelCol:{span:4},children:[e.jsx(i.Item,{name:"_id",hidden:!0,children:e.jsx(C,{})}),e.jsx(i.Item,{name:"roleName",label:"角色名稱",rules:[{required:!0,message:"請輸入角色名稱"}],children:e.jsx(C,{placeholder:"請輸入角色名稱"})}),e.jsx(i.Item,{name:"remark",label:"備註",children:e.jsx(C.TextArea,{placeholder:"請輸入備註"})})]})})}function M(c){const[d,o]=n.useState(!1),[h,p]=n.useState([]),[s,j]=n.useState([]),[l,x]=n.useState(),[m,r]=n.useState();n.useEffect(()=>{t()},[]);const t=async()=>{const b=await K.getMenuList();j(b)};n.useImperativeHandle(c.mRef,()=>({open:a}));const a=(b,u)=>{o(!0),x(u),p((u==null?void 0:u.permissionList.checkedKeys)||[])},g=async()=>{m&&(await y.updatePermission(m),N.success("操作成功"),k(),c.update())},k=()=>{o(!1),r(void 0)},_=(b,u)=>{p(b);const v=[],I=[];u.checkedNodes.map(R=>{R.menuType=="2"?v.push(R._id):I.push(R._id)}),r({_id:(l==null?void 0:l._id)||"",permissionList:{checkedKeys:v,halfCheckedKeys:I.concat(u.halfCheckedKeys)}})};return e.jsx(T,{title:"設置權限",width:600,open:d,okText:"確定",cancelText:"取消",onOk:g,onCancel:k,children:e.jsxs(i,{labelAlign:"right",labelCol:{span:4},children:[e.jsx(i.Item,{label:"角色名稱",children:l==null?void 0:l.roleName}),e.jsx(i.Item,{label:"權限",children:e.jsx(A,{defaultExpandAll:!0,fieldNames:{title:"menuName",key:"_id",children:"children"},checkable:!0,onCheck:_,checkedKeys:h,treeData:s})})]})})}function $(){const[c]=L(),d=n.useRef(),o=n.useRef(),h=({current:t,pageSize:a},g)=>y.getRoleList({...g,pageNum:t,pageSize:a}).then(k=>({total:k.page.total,list:k.list})),{tableProps:p,search:s}=F(h,{form:c,defaultPageSize:10}),j=[{title:"角色名稱",dataIndex:"roleName",key:"roleName"},{title:"備註",dataIndex:"remark",key:"remark"},{title:"更新時間",dataIndex:"updateTime",key:"updateTime",render(t){return w(t)}},{title:"創建時間",dataIndex:"createTime",key:"createTime",render(t){return w(t)}},{title:"操作",key:"action",render(t,a){return e.jsxs(S,{children:[e.jsx(f,{type:"text",onClick:()=>x(a),children:"編輯"}),e.jsx(f,{type:"text",onClick:()=>r(a),children:"設置權限"}),e.jsx(f,{type:"text",danger:!0,onClick:()=>m(a._id),children:"刪除"})]})}}],l=()=>{var t;(t=d.current)==null||t.open("create")},x=t=>{var a;(a=d.current)==null||a.open("edit",t)},m=t=>{T.confirm({title:"確認",content:"確認刪除該角色嗎？",async onOk(){await y.deleteRole({_id:t}),N.success("刪除成功"),s.submit()}})},r=t=>{var a;(a=o.current)==null||a.open("edit",t)};return e.jsxs("div",{className:"role-wrap",children:[e.jsxs(i,{form:c,className:"search-form",layout:"inline",children:[e.jsx(i.Item,{name:"roleName",label:"角色名稱",children:e.jsx(C,{placeholder:"請輸入角色名稱"})}),e.jsx(i.Item,{children:e.jsxs(S,{children:[e.jsx(f,{type:"primary",onClick:s.submit,children:"搜索"}),e.jsx(f,{type:"default",onClick:s.reset,children:"重置"})]})})]}),e.jsxs("div",{className:"base-table",children:[e.jsxs("div",{className:"header-wrapper",children:[e.jsx("div",{className:"title",children:"角色列表"}),e.jsx("div",{className:"action",children:e.jsx(f,{type:"primary",onClick:l,children:"新增"})})]}),e.jsx(P,{bordered:!0,rowKey:"_id",columns:j,...p})]}),e.jsx(E,{mRef:d,update:s.submit}),e.jsx(M,{mRef:o,update:s.submit})]})}export{$ as default};

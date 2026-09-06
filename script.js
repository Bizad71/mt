const $=id=>document.getElementById(id);
const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
let records=JSON.parse(localStorage.getItem("mahi_work")||"[]");

function duration(a,b){let [h1,m1]=a.split(":").map(Number),[h2,m2]=b.split(":").map(Number);let x=h1*60+m1,y=h2*60+m2;if(y<x)y+=1440;return y-x}
function fmt(min){return `${fa(Math.floor(min/60))} ساعت و ${fa(min%60)} دقیقه`}
function save(){localStorage.setItem("mahi_work",JSON.stringify(records))}
function render(){
 const rows=$("rows");rows.innerHTML="";
 let total=records.reduce((s,r)=>s+r.min,0);
 let days=new Set(records.map(r=>r.date)).size;
 $("monthHours").textContent=fa((total/60).toFixed(1));
 $("workDays").textContent=fa(days);
 $("avgHours").textContent=fa(days?(total/60/days).toFixed(1):"0");
 let today=new Date().toLocaleDateString("fa-IR").replace(/-/g,"/");
 let tm=records.filter(r=>r.date===today).reduce((s,r)=>s+r.min,0);
 $("todayHours").textContent=fa((tm/60).toFixed(1));
 $("empty").style.display=records.length?"none":"block";
 records.forEach((r,i)=>{
  let tr=document.createElement("tr");tr.innerHTML=`<td>${r.date}</td><td>${r.day}</td><td>${r.start}</td><td>${r.end}</td><td>${fmt(r.min)}</td><td><button class="delete" onclick="removeRec(${i})">حذف</button></td>`;rows.appendChild(tr)
 });
 draw(total)
}
function removeRec(i){records.splice(i,1);save();render()}
$("addBtn").onclick=()=>{
 let date=$("date").value.trim(),start=$("start").value,end=$("end").value;
 if(!date||!start||!end)return alert("تاریخ، ورود و خروج را کامل وارد کنید.");
 if(start===end)return alert("ساعت ورود و خروج نمی‌تواند یکسان باشد.");
 records.push({date,day:$("weekday").value,start,end,min:duration(start,end)});save();render();
 $("start").value="";$("end").value="";
}
$("clearBtn").onclick=()=>{if(confirm("همه ثبت‌ها پاک شوند؟")){records=[];save();render()}}
function draw(total){
 let c=$("barChart"),ctx=c.getContext("2d"),w=c.clientWidth*devicePixelRatio,h=245*devicePixelRatio;c.width=w;c.height=h;ctx.clearRect(0,0,w,h);ctx.scale(devicePixelRatio,devicePixelRatio);w=c.clientWidth;h=245;
 let groups={};records.forEach(r=>groups[r.date]=(groups[r.date]||0)+r.min/60);let arr=Object.entries(groups).slice(-12);
 let max=Math.max(8,...arr.map(x=>x[1])),bw=Math.max(12,(w-45)/Math.max(arr.length,1)-10);
 ctx.font="11px Tahoma";ctx.textAlign="center";
 arr.forEach(([d,v],i)=>{let x=35+i*((w-45)/Math.max(arr.length,1))+8,y=h-35-(v/max)*(h-65);ctx.fillStyle="#ff55bd";ctx.shadowBlur=15;ctx.shadowColor="#ff55bd";ctx.fillRect(x,y,bw,(h-35)-y);ctx.shadowBlur=0;ctx.fillStyle="#cdbdca";ctx.fillText(d.slice(-5),x+bw/2,h-16);ctx.fillStyle="#fff";ctx.fillText(v.toFixed(1),x+bw/2,y-7)});
 ctx.strokeStyle="rgba(255,255,255,.1)";ctx.beginPath();ctx.moveTo(25,h-35);ctx.lineTo(w-10,h-35);ctx.stroke();
 let d=$("donutChart"),dc=d.getContext("2d"),dw=d.clientWidth*devicePixelRatio,dh=245*devicePixelRatio;d.width=dw;d.height=dh;dc.clearRect(0,0,dw,dh);dc.scale(devicePixelRatio,devicePixelRatio);let cx=d.clientWidth/2,cy=122,r=82;let target=176, pct=Math.min(total/60/target,1);dc.lineWidth=22;dc.lineCap="round";dc.beginPath();dc.strokeStyle="#403645";dc.arc(cx,cy,r,0,Math.PI*2);dc.stroke();dc.beginPath();dc.strokeStyle="#ff55bd";dc.shadowBlur=18;dc.shadowColor="#ff55bd";dc.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);dc.stroke();dc.shadowBlur=0;$("donutText").textContent=fa(Math.round(pct*100))+"٪";
}
window.addEventListener("resize",render);render();

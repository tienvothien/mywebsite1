const SHEET_ID = "YOUR_SHEET_ID_HERE";
const READ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

async function loadData() {
    const res = await fetch(READ_URL);
    const csv = await res.text();
    const rows = csv.trim().split("\n").slice(1).map(r => r.split(","));
    const tbody = document.querySelector("#docTable tbody");
    rows.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td>${r[0]}</td>
            <td>${r[1]}</td>
            <td>${r[2]}</td>
            <td>${r[3]}</td>
            <td><a href="${r[4]}" target="_blank">Xem</a></td>
        </tr>`;
    });
}

if (document.querySelector("#docTable")) loadData();

document.getElementById("addForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const row = [fd.get("so_hieu"), fd.get("ngay_ban_hanh"), fd.get("trich_yeu"), fd.get("co_quan"), fd.get("link_pdf")];

    await fetch(`https://script.google.com/macros/s/AKfycbxPLACEHOLDER/exec?data=${encodeURIComponent(JSON.stringify(row))}`);

    alert("Đã lưu thành công!");
    e.target.reset();
});

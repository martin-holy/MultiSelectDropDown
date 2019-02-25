var xSelect = function(id) {
  return { 
    element: document.getElementById(id),

    create: function (data, multi = true, withDataSource = false) {
      let options = [],
          elm = document.createElement('div');
      
      data.forEach(x => options.push(`<li value='${x.value}' onclick="xSelect('${id}').select(this);">${x.name}</li>`));
      elm.id = id;
      elm.className = 'xSelect';
      elm.dataset.multi = multi;
      if (withDataSource) elm.dataset.dataSource = JSON.stringify(data);
      elm.innerHTML =
        `<div onclick="xSelect('${id}').show();">
          <div class="selectedOptions"></div>
          <div class="button">⏷</div>
        </div>
        <ul>${options.join('')}</ul>`;

      this.element = elm;
    },

    get: function() {
      let vals = [];
      this.element.querySelectorAll('.optionSelected').forEach(x => vals.push(x.value));
      return vals;
    },

    set: function (data) {
      this.element.querySelectorAll('li').forEach(x => 
        x.classList.toggle('optionSelected', data.includes(x.value)));
      this.list();
    },

    select: function(li) {
      if (this.element.dataset.multi == 'false') {
        this.element.querySelectorAll('li').forEach(x => x.classList.remove('optionSelected'));
        this.show();
      }
      li.classList.toggle('optionSelected');
      this.list();
    },

    list: function() {
      let out = [],
          dataSource = JSON.parse(this.element.dataset.dataSource || null);

      this.element.querySelectorAll('.optionSelected').forEach(x => {
        let style = '';

        if (dataSource != null) {
          let bgColor = dataSource.find(ds => ds.value == x.value).bgColor; 
          if (bgColor !== undefined)
            style = ` style="background-color:${bgColor};"`;
        }

        out.push(`<span${style}>${x.textContent}</span>`);
      });

      this.element.querySelector('.selectedOptions').innerHTML = out.join('');

      if (this.element.dataset.onchange)
        window[this.element.dataset.onchange]();
    },

    show: function() {
      let ul = this.element.querySelector('ul'),
          hide = ul.style.visibility == 'visible';
          
      ul.style.visibility = hide ? 'hidden' : 'visible';
      this.element.querySelector('.button').innerHTML = hide ? '⏷' : '✔';
      
      if (hide) window.removeEventListener('mouseup', this.xSelectClose);
      else window.addEventListener('mouseup', this.xSelectClose);
    },

    xSelectClose: function(e) {
      let currentElm = e.target,
          select;

      while (currentElm) {
        if (currentElm.classList.contains('xSelect')) {
          select = currentElm;
          break;
        }
        currentElm = currentElm.parentElement;
      }

      for (let elm of document.getElementsByClassName('xSelect')) {
        if (elm.querySelector('ul').style.visibility == 'visible' && elm != select) 
          xSelect(elm.id).show(); // hide
      }
    }
  };
}

window.addEventListener('load', function() {
  let select = xSelect('select1'),
      multiSelect = xSelect('multiSelect1'),
      data = [{value:1,name:'Option One'},{value:2,name:'Option Two'},{value:3,name:'Option Three'}],
      docBody = document.getElementsByTagName('body')[0];
  
  select.create(data, false);
  select.set([2]);

  multiSelect.create(data);
  multiSelect.set([1,2,3]);

  docBody.appendChild(select.element);
  docBody.appendChild(multiSelect.element);

  let test = xSelect('multiSelect1').get();
});
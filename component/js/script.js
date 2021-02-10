(function () {

  const BASE_URL = "https://movie-list.alphacamp.io"
  const INDEX_URL = BASE_URL + "/api/v1/movies/"
  const POSTER_URL = BASE_URL + "/posters/"
  const data = []
  let type = 'block'
  let page = 1

  axios
    .get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      getTotalPages(data)
      getPageData(page, data)
    })
    .catch((error) => console.log(error))

  const dataPanel = document.getElementById('data-panel')

  dataPanel.addEventListener('click', (event) => {
    showMovie(event.target.dataset.id)
  })

  const mode = document.getElementById('mode-btn')

  mode.addEventListener('click', event => {
    if (event.target.matches('.mode-line')) {
      console.log(event.target.dataset.type)
      type = event.target.dataset.type
      getPageData(page)
    } else if (event.target.matches('.mode-block')) {
      console.log(event.target.dataset.type)
      type = event.target.dataset.type
      getPageData(page)
    } else if (event.target.matches('.mode-sort')) {
      type = event.target.dataset.type
      getPageData(page)
    }

  })


  function displayDataList(data) {
    let htmlContent = ''
    if (type === 'block') {
      data.forEach(function (item) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card border-secondary mb-3">
            <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            </div>
          </div>
        </div>
        `
      })
    } else if (type === 'line') {

      htmlContent = '<ul class="list-group list-group-flush">'
      data.forEach(function (item) {
        htmlContent += `
        <li class="list-group-item">
          ${item.title}
          <div class="info-btn">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
          </div>
        </li> 
      `
      })
      htmlContent += '</ul>'
    }
    dataPanel.innerHTML = htmlContent
  }

  function displayLineList(data) {
    let htmlContent = '<ul class="list-group list-group-flush">'
    data.forEach(function (item) {
      htmlContent += `
        <li class="list-group-item">
          ${item.title}
          <div class="info-btn">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
          </div>
        </li> 
      `
    })
    htmlContent += '</ul>'
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    const url = INDEX_URL + id
    console.log(url)

    axios.get(url)
      .then((response) => {
        const data = response.data.results
        console.log(data)

        modalTitle.textContent = data.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at: ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
  }


  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  searchForm.addEventListener('submit', event => {
    event.preventDefault()

    let results = []
    console.log(searchInput.value)
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
    searchInput.value = ``
  })

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>`
    }
    pagination.innerHTML = pageItemContent
  }

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    page = event.target.dataset.page
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  let paginationData = []
  function getPageData(pageNum, data) {

    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }


})()
<script setup>

</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="#"><img src="@/assets/logo2.png" style="width: 100px; height: auto;" /></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#">어디가니?</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">함께가요</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">여행도장</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">발자취</a>
            </li>
            <li class="nav-item dropdown">

              <img class="nav-link dropdown-toggle rounded-circle" src="@/assets/noprofile.jpg" id="navbarDropdown"
                role="button" data-bs-toggle="dropdown" aria-expanded="false"
                style="width: 3rem; height: 3rem; object-fit: cover" />
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">마이페이지</a></li>
                <li><a class="dropdown-item" href="#">로그아웃</a></li>
                <li><a class="dropdown-item" href="#">로그인</a></li>
                <li><a class="dropdown-item" href="#">회원가입</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped></style>
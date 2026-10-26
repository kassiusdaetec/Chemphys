<?php

session_start();

$email = $_POST["email"];
$senha = $_POST["senha"];

$con = mysqli_connect(
    "localhost",
    "root",
    "",
    "chemphys"
);

$sql = "SELECT * FROM usuario 
        WHERE email='$email' 
        AND senha='$senha'";

$resultado = mysqli_query($con, $sql);

$achou = false;
foreach ($resultado as $usuario) {
    $_SESSION["usuario"] = $usuario["usuario"];
    $_SESSION["email"] = $usuario["email"];
    $achou = true;
}

if ($achou) {

    header("Location:Dashboard.php");
    exit();
}
else {

    echo "<script>alert('Email ou senha incorretos.');</script>";
    echo "<script>window.location.href = 'loginChemPhys.html';</script>";
}

?>
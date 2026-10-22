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

if (mysqli_num_rows($resultado) > 0) {

    $usuario = mysqli_fetch_assoc($resultado);

    $_SESSION["usuario"] = $usuario["usuario"];
    $_SESSION["email"] = $usuario["email"];

    header("Location: Dashboard.php");
    exit();

} else {

    echo "Email ou senha incorretos.";
    echo "<br>Volte para a página de login";


}

?>
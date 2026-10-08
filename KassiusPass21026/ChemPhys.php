<?php
if($_SERVER["REQUEST_METHOD"]=="POST"){
$nome=$_POST['nome'];
$snome=htmlspecialchars($nome);
$emai=$_POST['email'];
$email=htmlspecialchars($emai);
$word=$_POST['senha'];
$sword=htmlspecialchars($word);
$con=mysqlI_connect(
    'localhost', 'root', '12345678', 'chemphys'
);
mysqlI_query(
    $con, "insert into usuario(usuario, email, senha) values('$snome', '$email', '$sword')"
);
header("Location: Dashboard.html");
    exit();
}
?>
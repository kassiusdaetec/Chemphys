<?php
if($_SERVER["REQUEST_METHOD"]=="POST"){
$nome=$_POST['name'];
$snome=htmlspecialchars($nome);
$usua=$_POST['user'];
$susua=htmlspecialchars($usua);
$word=$_POST['pass'];
$sword=htmlspecialchars($word);
echo "Usuário criado com sucesso. Bem vindo, ".$nome;
echo "<br>";

};
$con=mysqlI_connect(
    'localhost', 'root', '12345678', 'cadastro'
);
mysqlI_query(
    $con, "insert into login(nome, uuser, senha) values('$snome', '$susua', '$sword')"
);
?>
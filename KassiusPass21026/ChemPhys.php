<?php
session_start(); 

if($_SERVER["REQUEST_METHOD"]=="POST"){

    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $word = $_POST['senha'];

    $con = mysqli_connect('localhost', 'root', '', 'chemphys');

    $verificar = mysqli_query(
        $con,
        "SELECT * FROM usuario WHERE email='$email'"
    );

    $jaCadastrado = false;
    foreach($verificar as $linha){
        $jaCadastrado = true;
    }

    if($jaCadastrado){
        echo "<script>alert('Este email já foi cadastrado!');</script>";
        echo "<script>window.location.href = 'cadastro.html';</script>";
    }else{
        mysqli_query(
            $con,
            "INSERT INTO usuario(usuario, email, senha)
             VALUES('$nome', '$email', '$word')"
        );

        $_SESSION['usuario'] = $nome; 

        header("Location:Dashboard.php");
        exit(); 
    }
}
?>


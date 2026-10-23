```php
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

    if(mysqli_num_rows($verificar) > 0){
        echo "Este email já foi cadastrado!<br>";
        echo "Volte a pagina de cadastro";
    }else{
        mysqli_query(
            $con,
            "INSERT INTO usuario(usuario, email, senha)
             VALUES('$nome', '$email', '$word')"
        );

        $_SESSION['usuario_logado'] = $nome; 

        header("Location: Dashboard.php");
        exit(); 
    }
}
?>
```

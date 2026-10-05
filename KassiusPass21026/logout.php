<?php
$id = $_GET['id_user'];
$con = mysqli_connect('localhost','root','12345678','aulaphp');
mysqli_query($con,"DELETE FROM aluno WHERE id_usuario = '$id'");
header("Location:DashBoard.php");
?>
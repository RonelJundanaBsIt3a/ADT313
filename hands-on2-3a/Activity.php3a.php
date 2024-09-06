<h1> Hands-on Activity it3a </h1>
<?php

$table = array(
    "Header" => array(
        "Student id",
        "FirstName",
        "LastName",
        "Section",
        "Course",
        "YearLevel",
    ),
    "Body" =>array(
     array(
        
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
        
    ),
    array(
        
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
       "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
       "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
        
       "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
       "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
        
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    ),
    array(
       
        "firstName" => "firstName",
        "lastName" =>  "lastName",
        "section" => "section",
        "course" => "course",
        "yearLevel" => "yearLevel" 
    )
    ),    
)
?>
    <table border = "1">  
        <thead>
          <?php
          for($i = 0; $i <= count($table["Header"]) -1; $i++) {
            echo "<th>".$table["Header"][$i]."</th>";
          }

          ?>
          
</thead>
<tbody>
    <?php
    for($i = 0; $i <= count($table["Body"]) - 1; $i++) {
        echo "<tr>";
        echo "<td>".$i."</td>";
        echo "<td>".$table["Body"][$i]["firstName"]."</td>";    
        echo "<td>".$table["Body"][$i]["lastName"]."</td>";
        echo "<td>".$table["Body"][$i]["section"]."</td>";
        echo "<td>".$table["Body"][$i]["course"]."</td>";
        echo "<td>".$table["Body"][$i]["yearLevel"]."</td>";
        echo "</tr>";
    }
    ?>
    </tbody>
    <table/>
 

BEGIN { 
  curly = 0; 
  round = 0; 
  square = 0; 
}
{
  for (i = 1; i <= length($0); i++) {
    char = substr($0, i, 1);
    if (char == "{") curly++;
    else if (char == "}") curly--;
    else if (char == "(") round++;
    else if (char == ")") round--;
    else if (char == "[") square++;
    else if (char == "]") square--;
    
    if (curly < 0) {
      print "Extra } found at line " NR ", position " i;
      exit 1;
    }
    if (round < 0) {
      print "Extra ) found at line " NR ", position " i;
      exit 1;
    }
    if (square < 0) {
      print "Extra ] found at line " NR ", position " i;
      exit 1;
    }
  }
}
END {
  print "Final brace counts:";
  print "  { } balance: " curly;
  print "  ( ) balance: " round;
  print "  [ ] balance: " square;
  if (curly != 0 || round != 0 || square != 0) {
    print "Unbalanced braces found!";
    exit 1;
  } else {
    print "All braces balanced!";
  }
}

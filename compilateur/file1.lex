%{
	#include <stdio.h>
	#include "y.tab.h"

	int echo(char *msg){
		fprintf(stderr, "[%s:%s]", msg, yytext);

	}
%}


LETTRE [A-Za-z]
ENTIER [0-9]+
%%


"+"	{echo("PLUS"); return plus ;}
"-"	{echo("MOINS");return moins;}
"^"	{echo("PUISSANCE");return puissance ;}
"\n"	{return endl;}
{LETTRE}	{echo("LETTRE");return Var;}
{ENTIER}	{echo("ENTIER");return chiffre ;}
.	{yyerror("ERREEEEUUUUR\n");}
%%

int yywrap() {
	return 1;
}
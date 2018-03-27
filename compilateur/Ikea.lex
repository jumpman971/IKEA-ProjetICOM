%{
	#include <stdio.h>
	#include "y.tab.h"

	int echo(char *msg){
		fprintf(stderr, "[%s:%s]", msg, yytext);

	}
%}

ENTIER [0-9]+
STRING [A-Za-z]+
SPACE  " "

%%

\n						{return eol;}
{ENTIER}					{yylval.num = atoi(yytext);return Quantite;}
"-"						{return Retrait;}
(rotate|Rotation|Rotate|rotation)		{return Rotation;}
{STRING}({SPACE}+{STRING})* 			{yylval.str = strdup(yytext);return Meuble;}
({ENTIER}(:|,|;){ENTIER}) 			{yylval.str = strdup(yytext);return Coordonnees;}

.						{;}
%%

int yywrap () {return 1;}

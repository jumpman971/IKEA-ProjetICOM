%{
#include <stdio.h>
#include <stdlib.h>
extern int yylex();


int yyerror (char const *msg) {
	printf("ERREUUUUUE BISON\n");
	return 0;
}
%}

%start Ligne

%left plus moins
%token puissance endl
%token chiffre Var

%%
Ligne 		: Ligne Polynome endl {printf("Syntaxe OK\n");}
			| Ligne error endl {yyerrok;}
			| /* mot vide */ {printf("saisir votre polynome\n");}
;
Polynome 	: Polynome plus Terme 	{printf("Polynome1\n");}
			| Polynome moins Terme	{printf("Polynome2\n");}
			| Terme {printf("Polynome3\n");}
;
Terme 		: chiffre {printf("Terme1\n");}
			| Var {printf("Terme2\n");}
			| Var puissance chiffre {printf("Terme3\n");}
			| moins Terme {printf("Terme4\n");}
			| chiffre Var {printf("Terme5\n");}
			| chiffre Var puissance chiffre {printf("Terme6\n");}
;
%%
	

int main(void) {
	return yyparse();
}
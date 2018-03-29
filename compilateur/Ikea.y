
%{
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	extern int yylex();
	int yyerror (char const *message) {
		fputs (message, stderr); fputc ('\n', stderr); return 0;
	}

	// Variables utilisées
	int quantite;
	int nbCoordonnees;
	int estIncorrect;
%}


%start S
%union { int num; char* str; }
%token Rotation eol
%token <num> Quantite
%token <str> Coordonnees
%token <str> Meuble
%left Retrait
%type <str> E
%type <str> C

%%
S :	
	| S C eol		{
					if (estIncorrect)
						yyerror("Number of coordinates doesn't match to quantity");
					else
						printf("Commande détectée\n"); 
					nbCoordonnees = 0;quantite = 0;estIncorrect = 0;
				} 
	| S error eol		{yyerrok;}

C :	 C E	
	|E

E :	  Meuble Coordonnees				{printf("Ok\n");}
	| Quantite Meuble T				{
								quantite = quantite + $1;
								if (quantite != nbCoordonnees)
									estIncorrect = 1;
							}
	| Retrait Coordonnees			 	{printf("Retrait\n");}

T :	  Coordonnees					{nbCoordonnees++;}
	| Coordonnees Rotation				{nbCoordonnees++;}
	| T Coordonnees					{nbCoordonnees++;}
	| T Coordonnees Rotation			{nbCoordonnees++;};
	
%%


int main(void) 
{
	nbCoordonnees = 0;estIncorrect = 0;quantite = 0;
	return yyparse(); 
}

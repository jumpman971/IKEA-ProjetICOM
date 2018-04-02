
%{
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	extern int yylex();

	// Variables utilisées
	int quantite;
	int nbCoordonnees;
	int estIncorrect;
	int numMessage = 0;
	int sizeMessage;
	int superficie;

	// gestion strings
	char* nomMessage;
	char* codeJS;
	char* messageRetourne;
	char  strInitialisation[] = "loadFurniture('test', ['101', '101', '111']);";
	

	void updateNomMessage(char *nom, int* num)
	{
		*num=*num+1;
		nom[0] = '\0';
		sprintf(nom,"%s%d","received",*num);
	}

	void buildMessage(char *message, char *nomMessage,char *code,int* lengthMessage)
	{
		*lengthMessage = 0;
		message[0] = '\0';
		sprintf(message,"%s%s%s%s%s","if (typeof ",nomMessage," === 'undefined' || !",nomMessage,") {");
		sprintf(message,"%s%s",message,code);
		*lengthMessage = sprintf(message,"%s%s%s",message,nomMessage," = true;}");
	}

	void sendMessage(char *message,int sizeMessage,char *nomMessage,int numMessage)
	{
		FILE *fp;
   		fp = fopen( "../js/com.js" , "w" );
   		fwrite(message , 1 , sizeMessage , fp );
   		fclose(fp);
		updateNomMessage(nomMessage,&numMessage);
	}
	
	void clearFile()
	{
		FILE *fp;
   		fp = fopen( "../js/com.js" , "w" );
   		fclose(fp);
	}
	
	int yyerror (char const *message) 
	{
		fputs (message, stderr); 
		fputc ('\n', stderr); 
		return 0;
	}
	
	void checkErreur()
	{
		if (quantite != nbCoordonnees)
			estIncorrect = 1;
	}
	
	void initVars()
	{
		nbCoordonnees = 0;estIncorrect = 0;quantite = 0;
	}
	
%}


%start S
%union { int num; char* str; }
%token Rotation eol Exit
%token <num> Quantite
%token <str> Coordonnees
%token <str> Meuble
%left Retrait
%type <str> E
%type <str> C

%%
S :	
	
	| S Exit eol		{	clearFile();exit(0);}
	| S C eol		{
					if (estIncorrect)
						yyerror("Number of coordinates doesn't match to quantity");
					else
						printf("Commande détectée : %s\n",codeJS);
					initVars();
				} 
	| S error eol		{yyerrok;}

C :	 C E	
	|E

E :	  Meuble Coordonnees				{printf("Ok\n");}
	| Quantite Meuble T				{
								quantite = quantite + $1;
								checkErreur();
								sprintf(codeJS,"%s%s",codeJS,strdup($$));
							}
	| Retrait Coordonnees			 	{printf("Retrait\n");}

T :	  Coordonnees					{nbCoordonnees++;}
	| Coordonnees Rotation				{nbCoordonnees++;}
	| T Coordonnees					{nbCoordonnees++;}
	| T Coordonnees Rotation			{nbCoordonnees++;};
	
%%


int main(void) 
{
	//Allocations
	codeJS = (char*)malloc(sizeof(char)*500);
	messageRetourne = (char*)malloc(sizeof(char)*500);
	nomMessage = (char*)malloc(sizeof(char)*20);
	
	initVars();
	
	//Initialiser les éléments
	updateNomMessage(nomMessage,&numMessage);
	buildMessage(messageRetourne,nomMessage,strInitialisation,&sizeMessage);
	sendMessage(messageRetourne,sizeMessage,nomMessage,numMessage);

	//Choix de la superficie
	printf("Console IKEA\n\nVeuillez entrer la superficie de la piece (entier) : ");
	scanf("%d",&superficie);
	sprintf(codeJS,"%s%d%s","setRoomSize(",superficie,");");
	buildMessage(messageRetourne,nomMessage,codeJS,&sizeMessage);
	sendMessage(messageRetourne,sizeMessage,nomMessage,numMessage); 

	return yyparse();
	

}

#correlation between the two metrics as vectors. 
#spearman correlation relies on monotonic data and therefore can't be used.
#we want pearson linear correlation, I think. 

#cor(c(input[[1]]),c(input[[2]]),method = "pearson")
#print (input[[1]])
#print(lapply(input[[1]],'[[[',1))
#print(unlist(input[[1]])[c(TRUE, FALSE)])

x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[2])[,1] 
cor(x,y,method = "pearson")


#correlation between the two metrics as vectors. 

x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[2])[,1] 
cov(x,y)



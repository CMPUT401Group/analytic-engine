 #this returns the time of the local min in a dataset. 
x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[1])[,2]
min <- which.min(x)

return (y[min])

-- CreateTable
CREATE TABLE "_PlaylistCollaborators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlaylistCollaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlaylistCollaborators_B_index" ON "_PlaylistCollaborators"("B");

-- AddForeignKey
ALTER TABLE "_PlaylistCollaborators" ADD CONSTRAINT "_PlaylistCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistCollaborators" ADD CONSTRAINT "_PlaylistCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
